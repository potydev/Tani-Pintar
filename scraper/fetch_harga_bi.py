import requests
import json
import os
import time
from datetime import datetime

BASE_URL = "https://www.bi.go.id/hargapangan/WebSite/Home/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.bi.go.id/hargapangan/Home"
}

# Commodity IDs from Bank Indonesia PIHPS
COMMODITIES = {
    "5": "Bawang Merah",
    "6": "Bawang Putih",
    "7": "Cabai Merah",
    "8": "Cabai Rawit",
    "1": "Beras"
}

def get_timestamp_ms():
    return int(time.time() * 1000)

def fetch_commodities_tree():
    url = f"{BASE_URL}GetCommoditiesTree?_={get_timestamp_ms()}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.json().get("data", [])
    except Exception as e:
        print(f"[ERROR] Failed to fetch commodities tree: {e}")
    return []

def fetch_provinces():
    url = f"{BASE_URL}GetProvinceAll?filter=%5B%22province_id%22%2C0%5D&_={get_timestamp_ms()}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.json().get("data", [])
    except Exception as e:
        print(f"[ERROR] Failed to fetch provinces: {e}")
    return []

def fetch_grid_data(date_str, commodity_id, prov_id=0):
    """
    date_str format: "Aug 6, 2026" or current date format
    """
    url = f"{BASE_URL}GetGridData1?tanggal={date_str}&commodity={commodity_id}&priceType=1&isPasokan=1&jenis=1&periode=1&provId={prov_id}&_={get_timestamp_ms()}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.json().get("data", [])
    except Exception as e:
        print(f"[ERROR] Failed to fetch grid data for commodity {commodity_id}: {e}")
    return []

def run_scraping():
    print("==================================================")
    print("  TaniPintar - Bank Indonesia PIHPS Price Scraper  ")
    print("==================================================")

    now = datetime.now()
    # Format required by BI API: "Aug 6, 2026"
    date_formatted = now.strftime("%b %d, %Y")
    print(f"[*] Target Date: {date_formatted}")

    result_data = {
        "updated_at": now.isoformat(),
        "target_date": date_formatted,
        "commodities": {}
    }

    for comm_id, comm_name in COMMODITIES.items():
        print(f"[*] Fetching price data for: {comm_name} (ID: {comm_id})...")
        grid_data = fetch_grid_data(date_formatted, comm_id, prov_id=0)
        
        provinces_prices = []
        for item in grid_data:
            provinces_prices.append({
                "prov_id": item.get("ProvID"),
                "province": item.get("Provinsi"),
                "date": item.get("Tanggal"),
                "commodity": item.get("Komoditas"),
                "price": item.get("Nilai"),
                "price_diff": item.get("NilaiDiff"),
                "national_avg": item.get("SemuaProvinsi"),
                "percentage_change": item.get("Percentage")
            })

        result_data["commodities"][comm_name] = {
            "commodity_id": comm_id,
            "national_avg": provinces_prices[0]["national_avg"] if provinces_prices else 0,
            "provinces_count": len(provinces_prices),
            "prices": provinces_prices
        }
        print(f"    -> Retrieved {len(provinces_prices)} regional price points.")

    # Save to src/data/harga_pangan_realtime.json
    output_dir = os.path.join(os.path.dirname(__file__), "../src/data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "harga_pangan_realtime.json")

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result_data, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Scraped data saved to: {output_file}")
    print("==================================================")

if __name__ == "__main__":
    run_scraping()
