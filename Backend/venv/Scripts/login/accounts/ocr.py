import requests
import uuid
import time
import json
import base64

def NAVER_OCR(img_64):
    api_url = 'https://mh3idgymxg.apigw.ntruss.com/custom/v1/16184/cbbcb487fd633ec613a5b0e8807709759a6d5f9351a05899001a46eab9980724/document/receipt'
    secret_key = 'TEtKVGZlZ2xsdnlUb2JrZG5MSW9Gc2h4bldFcGJQT1A='
    img = base64.b64encode(img_64.read()).decode()

    request_json = {
        'images': [
            {
                'format': 'jpg',
                'name': 'receipt',
                'data': img
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = json.dumps(request_json).encode('UTF-8')

    headers = {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': secret_key
    }

    response = requests.request(
        "POST", api_url, headers=headers, data=payload
    )
    
    return (response.text.encode('utf8'))
