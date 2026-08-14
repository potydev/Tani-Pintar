import requests
import json
import os
import time
import subprocess
from datetime import datetime, timedelta

# MySQL Connection Settings
MYSQL_USER = "root"
MYSQL_PASSWORD = "Sandibaruu11"  # Sudo password for Ubuntu authentication
MYSQL_DB = "db_tani_pintar"
MYSQL_USE_SUDO = True            # Ubuntu requires sudo to connect as root via auth_socket

BASE_URL = "https://www.bi.go.id/hargapangan/WebSite/Home/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.bi.go.id/hargapangan/Home"
}

# Sub-variant Commodity IDs from Bank Indonesia PIHPS (detailed leaves)
COMMODITIES = {
    # Beras
    "1_1": "Beras Kualitas Bawah I",
    "1_2": "Beras Kualitas Bawah II",
    "1_3": "Beras Kualitas Medium I",
    "1_4": "Beras Kualitas Medium II",
    "1_5": "Beras Kualitas Super I",
    "1_6": "Beras Kualitas Super II",
    # Daging Ayam
    "2_7": "Daging Ayam Ras Segar",
    # Daging Sapi
    "3_8": "Daging Sapi Kualitas 1",
    "3_9": "Daging Sapi Kualitas 2",
    # Telur Ayam
    "4_10": "Telur Ayam Ras Segar",
    # Bawang Merah
    "5_11": "Bawang Merah Ukuran Sedang",
    # Bawang Putih
    "6_12": "Bawang Putih Ukuran Sedang",
    # Cabai Merah
    "7_13": "Cabai Merah Besar",
    "7_14": "Cabai Merah Keriting",
    # Cabai Rawit
    "8_15": "Cabai Rawit Hijau",
    "8_16": "Cabai Rawit Merah",
    # Minyak Goreng
    "9_17": "Minyak Goreng Curah",
    "9_18": "Minyak Goreng Kemasan Bermerk 1",
    "9_19": "Minyak Goreng Kemasan Bermerk 2",
    # Gula Pasir
    "10_20": "Gula Pasir Kualitas Premium",
    "10_21": "Gula Pasir Lokal"
}

def get_timestamp_ms():
    return int(time.time() * 1000)

def parse_bi_date(date_str):
    if not date_str:
        return None
    try:
        # Format: "06 Agt 26" or "06 Agt 2026"
        parts = date_str.split()
        if len(parts) != 3:
            return None
        day = int(parts[0])
        month_abbr = parts[1].lower()
        year_part = parts[2]
        
        months_map = {
            "jan": 1, "feb": 2, "mar": 3, "apr": 4, "mei": 5, "jun": 6,
            "jul": 7, "agt": 8, "sep": 9, "okt": 10, "nov": 11, "des": 12
        }
        month = months_map.get(month_abbr, 1)
        
        if len(year_part) == 2:
            year = 2000 + int(year_part)
        else:
            year = int(year_part)
            
        return f"{year:04d}-{month:02d}-{day:02d}"
    except Exception as e:
        print(f"    [WARN] Failed to parse date string '{date_str}': {e}")
        return None

def save_to_mysql(result_data):
    print(f"[*] Exporting scraped data for {result_data.get('target_date')} to MySQL...")
    values = []
    
    for comm_name, comm_info in result_data.get("commodities", {}).items():
        comm_id_raw = comm_info.get("commodity_id")
        # In MySQL, we store commodity_id as VARCHAR or INT. Since it can be "1_1" (sub-variant), 
        # wait! Our commodity_id in MySQL table is INT!
        # Let's check the table structure of harga_pangan we created:
        # commodity_id INT NOT NULL
        # Wait, if commodity_id is INT, how can we store "1_1"?
        # Ah!!! "1_1" is a string, not an INT!
        # If we try to insert "1_1" into an INT column, MySQL will convert it to 1, or error out!
        # Let's check: does it error? Yes, "1_1" cannot be inserted as a clean unique INT if we also have "1_2" which also converts to 1!
        # Oh! This is a critical realization!
        # We need to change the commodity_id column in MySQL to VARCHAR(20) to support IDs like "1_1", "1_2", etc.!
        # Let's check how to alter the table:
        # ALTER TABLE harga_pangan MODIFY commodity_id VARCHAR(20) NOT NULL;
        # Yes! That is absolutely vital! Let's make sure we execute this SQL statement immediately.
        # But first, in our python script, we should treat comm_id as a string (VARCHAR).
        pass
        
        # Let's proceed with building the values list.
        comm_id = comm_info.get("commodity_id")
        national_avg = comm_info.get("national_avg")
        
        for price_item in comm_info.get("prices", []):
            prov_id = price_item.get("prov_id")
            province_name = price_item.get("province")
            province_name_escaped = province_name.replace("'", "''")
            
            tanggal_raw = price_item.get("date")
            tanggal_sql = parse_bi_date(tanggal_raw)
            if not tanggal_sql:
                continue
                
            price = price_item.get("price")
            price_diff = price_item.get("price_diff", "")
            price_diff_escaped = price_diff.replace("'", "''") if price_diff else ""
            
            pct_change = price_item.get("percentage_change")
            
            # Format numbers for SQL
            price_val = f"{price:.2f}" if price is not None else "0.00"
            nat_avg_val = f"{national_avg:.2f}" if national_avg is not None else "NULL"
            pct_val = f"{pct_change:.2f}" if pct_change is not None else "NULL"
            
            values.append(
                f"('{comm_id}', '{comm_name}', {prov_id}, '{province_name_escaped}', '{tanggal_sql}', {price_val}, '{price_diff_escaped}', {nat_avg_val}, {pct_val})"
            )
            
    if not values:
        print("    [WARN] No price records found to save to MySQL.")
        return
        
    query = (
        "INSERT INTO harga_pangan "
        "(commodity_id, commodity_name, prov_id, province_name, tanggal_bi, price, price_diff, national_avg, percentage_change) "
        "VALUES\n" + ",\n".join(values) + "\n"
        "ON DUPLICATE KEY UPDATE\n"
        "price = VALUES(price),\n"
        "price_diff = VALUES(price_diff),\n"
        "national_avg = VALUES(national_avg),\n"
        "percentage_change = VALUES(percentage_change);"
    )
    
    sql_file = os.path.join(os.path.dirname(__file__), "insert_temp.sql")
    with open(sql_file, "w", encoding="utf-8") as f:
        f.write(f"USE {MYSQL_DB};\n")
        f.write(query + "\n")
        
    try:
        if MYSQL_USE_SUDO:
            cmd = f"echo '{MYSQL_PASSWORD}' | sudo -S mysql -u {MYSQL_USER} -e \"SOURCE {sql_file}\""
        else:
            cmd = f"mysql -u {MYSQL_USER} -p'{MYSQL_PASSWORD}' -e \"SOURCE {sql_file}\""
            
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"[SUCCESS] Data for {result_data.get('target_date')} successfully saved/updated in MySQL database!")
        else:
            print(f"[ERROR] MySQL execution failed:\nStdout: {result.stdout}\nStderr: {result.stderr}")
    except Exception as e:
        print(f"[ERROR] Failed to execute MySQL CLI command: {e}")
    finally:
        if os.path.exists(sql_file):
            os.remove(sql_file)

def fetch_grid_data(date_str, commodity_id, prov_id=0):
    url = f"{BASE_URL}GetGridData1?tanggal={date_str}&commodity={commodity_id}&priceType=1&isPasokan=1&jenis=1&periode=1&provId={prov_id}&_={get_timestamp_ms()}"
    retries = 3
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            if response.status_code == 200:
                data = response.json().get("data", [])
                if data:
                    return data
                else:
                    # Some dates (like Sundays) legitimately return empty lists, so don't retry aggressively if status is 200 OK
                    return []
            else:
                print(f"    [WARN] Status {response.status_code} for commodity {commodity_id} (Attempt {attempt+1}/{retries})")
        except Exception as e:
            print(f"    [WARN] Request failed: {e} (Attempt {attempt+1}/{retries})")
        
        if attempt < retries - 1:
            time.sleep(2)
            
    return []

def run_scraping():
    print("==================================================")
    print("  TaniPintar - Bank Indonesia PIHPS Price Scraper  ")
    print("==================================================")

    # Force English month names
    ENGLISH_MONTHS = {
        1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
    }

    # Generate all dates from July 30, 2026 to today (August 7, 2026) to scrape history as requested
    now = datetime.now()
    start_date = datetime(2026, 7, 30)
    
    # If today is earlier than July 30, 2026, fallback to last 10 days
    if now < start_date:
        start_date = now - timedelta(days=9)
        
    target_dates = []
    curr = start_date
    while curr <= now:
        month_name = ENGLISH_MONTHS.get(curr.month, "Jan")
        date_formatted = f"{month_name} {curr.day}, {curr.year}"
        target_dates.append(date_formatted)
        curr += timedelta(days=1)
        
    print(f"[*] Total dates to scrape: {len(target_dates)} ({target_dates[0]} to {target_dates[-1]})")
    print(f"[*] Total commodities to scrape: {len(COMMODITIES)}")
    print("==================================================")

    latest_result_data = None

    for date_idx, target_date in enumerate(target_dates):
        print(f"\n---> Scrape Day ({date_idx + 1}/{len(target_dates)}): {target_date}")
        
        result_data = {
            "updated_at": datetime.now().isoformat(),
            "target_date": target_date,
            "commodities": {}
        }
        
        # Track if we retrieved any data at all for this day
        day_has_data = False
        
        for comm_id, comm_name in COMMODITIES.items():
            print(f"[*] Fetching {comm_name} (ID: {comm_id})...")
            grid_data = fetch_grid_data(target_date, comm_id, prov_id=0)
            
            provinces_prices = []
            for item in grid_data:
                raw_price = item.get("Nilai")
                try:
                    price = float(raw_price) if raw_price is not None else 0.0
                except:
                    price = 0.0
                    
                raw_diff = item.get("NilaiDiff")
                price_diff = str(raw_diff) if raw_diff is not None else "Rp0"
                
                raw_avg = item.get("SemuaProvinsi")
                try:
                    national_avg = float(raw_avg) if raw_avg is not None else 0.0
                except:
                    national_avg = 0.0
                    
                raw_pct = item.get("Percentage")
                try:
                    pct_change = float(raw_pct) if raw_pct is not None else 0.0
                except:
                    pct_change = 0.0
                    
                provinces_prices.append({
                    "prov_id": item.get("ProvID"),
                    "province": item.get("Provinsi"),
                    "date": item.get("Tanggal"),
                    "commodity": item.get("Komoditas"),
                    "price": price,
                    "price_diff": price_diff,
                    "national_avg": national_avg,
                    "percentage_change": pct_change
                })
            
            # Only save and output if we got data points
            if provinces_prices:
                day_has_data = True
                national_avg = provinces_prices[0].get("national_avg") or sum(p["price"] for p in provinces_prices) / len(provinces_prices)
                
                result_data["commodities"][comm_name] = {
                    "commodity_id": comm_id,
                    "national_avg": round(national_avg, 2),
                    "provinces_count": len(provinces_prices),
                    "prices": provinces_prices
                }
                print(f"    -> Retrieved {len(provinces_prices)} regional price points.")
            else:
                print(f"    -> No data available for this day.")
                
            # Polite delay between requests
            time.sleep(0.3)
            
        if day_has_data:
            latest_result_data = result_data
            save_to_mysql(result_data)
        else:
            print(f"[*] Skipping MySQL save for {target_date} because no data was retrieved.")

    # Save the latest day's successfully scraped data to the JSON file
    if latest_result_data:
        output_dir = os.path.join(os.path.dirname(__file__), "../src/data")
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, "harga_pangan_realtime.json")
        
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(latest_result_data, f, ensure_ascii=False, indent=2)
            
        print(f"\n[SUCCESS] Latest day's scraped data saved to: {output_file}")
        
    print("==================================================")

if __name__ == "__main__":
    run_scraping()
