# app.py (Flask)
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)

# ฟังก์ชันดึงข้อมูลจาก Open-Meteo API
@app.route('/get-weather', methods=['GET'])
def get_weather():
    url = "https://api.open-meteo.com/v1/forecast?latitude=7.0069&longitude=100.5007&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=Asia%2FBangkok"
    response = requests.get(url)
    return jsonify(response.json())  # ส่งข้อมูลอากาศกลับไปที่ frontend

# ฟังก์ชันสำหรับการพยากรณ์การตากผ้า
@app.route('/prediction', methods=['GET'])
def get_prediction():
    # ดึงข้อมูลอากาศจาก Open-Meteo API
    url = "https://api.open-meteo.com/v1/forecast?latitude=7.0069&longitude=100.5007&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=Asia%2FBangkok"
    response = requests.get(url)
    weather_data = response.json()['daily']

    # สร้าง DataFrame พร้อมหน่วยกำกับในชื่อคอลัมน์
    test_data = pd.DataFrame({
        'time': weather_data['time'],  # รวม time เป็น reference
        'temperature_2m_max (°C)': weather_data['temperature_2m_max'],
        'temperature_2m_min (°C)': weather_data['temperature_2m_min'],
        'apparent_temperature_max (°C)': weather_data['apparent_temperature_max'],
        'apparent_temperature_min (°C)': weather_data['apparent_temperature_min'],
        'daylight_duration (s)': weather_data['daylight_duration'],
        'sunshine_duration (s)': weather_data['sunshine_duration'],
        'uv_index_max ()': weather_data['uv_index_max'],  # เพิ่มหน่วยตามที่โมเดลคาดหวัง
        'uv_index_clear_sky_max ()': weather_data['uv_index_clear_sky_max'],  # เพิ่มหน่วยตามที่โมเดลคาดหวัง
        'precipitation_sum (mm)': weather_data['precipitation_sum'],
        'rain_sum (mm)': weather_data['rain_sum'],
        'showers_sum (mm)': weather_data['showers_sum'],
        'precipitation_hours (h)': weather_data['precipitation_hours'],
        'precipitation_probability_max (%)': weather_data['precipitation_probability_max'],
        'wind_speed_10m_max (km/h)': weather_data['wind_speed_10m_max'],
        'wind_gusts_10m_max (km/h)': weather_data['wind_gusts_10m_max'],
        'wind_direction_10m_dominant (°)': weather_data['wind_direction_10m_dominant'],
        'shortwave_radiation_sum (MJ/m²)': weather_data['shortwave_radiation_sum'],
        'et0_fao_evapotranspiration (mm)': weather_data['et0_fao_evapotranspiration'],
    })

    # โหลดโมเดล Logistic Regression ที่บันทึกไว้
    with open('Drying_logistic_regression_model.pkl', 'rb') as file:
        loaded_model = pickle.load(file)

    # ทำการพยากรณ์ (prediction) โดยใช้โมเดลที่โหลดมา
    predictions = loaded_model.predict(test_data.drop(columns=['time']))  # ลบ 'time' ออกถ้าไม่ต้องใช้

    # ส่งผลการพยากรณ์กลับไปในรูปแบบ JSON
    return jsonify({
        'predictions': predictions.tolist(),
        'dates': test_data['time'].tolist()  # ส่งคืนวันที่ที่ตรงกับการพยากรณ์แต่ละรายการ
    })


if __name__ == '__main__':
    app.run(debug=True)
