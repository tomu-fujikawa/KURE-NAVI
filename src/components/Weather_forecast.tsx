import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<{ date: string, maxTemp: number, minTemp: number, weatherCode: number }[]>([]);
  const day = ["今日", "明日", "明後日"];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=34.2481&longitude=132.5656&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Tokyo"
        );
        const data = await response.json();

        const forecast = data.daily.time.slice(0, 3).map((date: string, index: number) => ({
          date,
          maxTemp: data.daily.temperature_2m_max[index],
          minTemp: data.daily.temperature_2m_min[index],
          weatherCode: data.daily.weathercode[index],
        }));

        setWeatherData(forecast);
      } catch (error) {
        console.error("天気情報の取得に失敗しました", error);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    const weatherIcons: { [key: number]: string } = {
      0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️",
      45: "🌫", 48: "🌫", 51: "🌦", 53: "🌧",
      55: "🌧", 56: "🌨", 57: "🌨", 61: "🌧",
      63: "🌧", 65: "⛈", 80: "🌦", 81: "🌧",
      82: "⛈", 85: "❄️", 86: "❄️"
    };
    return weatherIcons[code] || "❓";
  };

  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: isVisible ? "16px 32px 24px" : "16px",
      borderRadius: "12px",
      zIndex: "9999"
    }}>
      {/* 天気表示トグルボタン */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          style={{
            cursor: "pointer",
            border: "none",
            background: "transparent"
          }}
        >
          <img src="wheatherForcast_false.svg" style={{ width: "50px" }} />
        </button>
      )}

      {/* 天気情報ウィジェット */}
      {isVisible && (
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #007BFF, #00A8FF)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          width: "280px",
          textAlign: "center"
        }}>
          {/* 閉じるボタン */}
          <button
            onClick={() => setIsVisible(false)}
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              background: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              border: "none",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ❌
          </button>

          <h2 style={{ fontSize: "24px", marginBottom: "15px", fontWeight:"bold"}}>呉市の天気</h2>
          
          {/* 天気カードのコンテナ */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            {weatherData.map(({ date, maxTemp, minTemp, weatherCode }, index) => (
              <div key={date} style={{
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backdropFilter: "blur(8px)",
                flexDirection:"column"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{day[index]}</h3>
                <div style={{display:"flex", flexDirection:"column"}}>
                <span style={{ fontSize: "50px" }}>{getWeatherIcon(weatherCode)}</span>
                <span style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#FFF"
                }}>
                  {maxTemp}°C / {minTemp}°C
                </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}