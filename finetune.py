import argparse
import json
import os
import random
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AdamW, get_linear_schedule_with_warmup
from tqdm import tqdm

MODEL_NAME = "distilbert-base-uncased-finetuned-sst-2-english"
LABEL2ID = {"negative": 0, "positive": 1}
ID2LABEL = ["negative", "positive"]

# Pin random seeds for reproducibility
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

class SentimentDataset(Dataset):
    def __init__(self, data, tokenizer, max_length=128):
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length
    def __len__(self):
        return len(self.data)
    def __getitem__(self, idx):
        item = self.data[idx]
        encoding = self.tokenizer(
            item["text"],
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )
        label = LABEL2ID[item["label"]]
        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(label, dtype=torch.long)
        }

def load_data(path):
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            data.append(json.loads(line))
    return data

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-data", required=True, help="Path to data.jsonl")
    parser.add_argument("-epochs", type=int, default=3)
    parser.add_argument("-lr", type=float, default=3e-5)
    args = parser.parse_args()

    set_seed()
    data = load_data(args.data)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    model.train()

    dataset = SentimentDataset(data, tokenizer)
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

    optimizer = AdamW(model.parameters(), lr=args.lr)
    total_steps = len(dataloader) * args.epochs
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

    for epoch in range(args.epochs):
        print(f"Epoch {epoch+1}/{args.epochs}")
        for batch in tqdm(dataloader):
            optimizer.zero_grad()
            outputs = model(
                input_ids=batch["input_ids"],
                attention_mask=batch["attention_mask"],
                labels=batch["labels"]
            )
            loss = outputs.loss
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            scheduler.step()

    os.makedirs("./model", exist_ok=True)
    model.save_pretrained("./model")
    tokenizer.save_pretrained("./model")
    print("Model saved to ./model/")

if __name__ == "__main__":
    main() 