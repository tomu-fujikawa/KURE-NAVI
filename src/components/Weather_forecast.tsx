import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<{ date: string, maxTemp: number, minTemp: number, weatherCode: number }[]>([]);
  const day = ["今日", "明日", "明後日"];
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
        console.log("forecast",forecast)
      } catch (error) {
        console.error("天気情報の取得に失敗しました", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    const weatherIcons: { [key: number]: string } = {
        0: "☀️",  // 快晴
        1: "🌤",  // 晴れ（少し雲）
        2: "⛅",  // 曇りがち
        3: "☁️",  // 曇り
      
        45: "🌫", // 霧
        48: "🌫", // 霧（霧氷あり）
      
        51: "🌦", // 小雨
        53: "🌦", // 中程度の霧雨
        55: "🌧", // 強い霧雨
        56: "🌨", // 凍る小雨
        57: "🌨", // 凍る強い霧雨
      
        61: "🌧", // 小雨（にわか雨）
        63: "🌧", // 中程度の雨
        65: "⛈", // 強い雨（雷雨の可能性）
      
        66: "❄️", // 凍る小雨
        67: "❄️", // 凍る強い雨
      
        71: "🌨", // 小雪
        73: "🌨", // 中程度の雪
        75: "❄️", // 強い雪
      
        77: "❄️", // 霧雪
      
        80: "🌦", // 小さなにわか雨
        81: "🌧", // 中程度のにわか雨
        82: "⛈", // 強いにわか雨（雷雨）
      
        85: "❄️", // 小さなにわか雪
        86: "❄️", // 強いにわか雪
      
        95: "⛈", // 雷雨（弱〜中）
        96: "⛈", // 雷雨（雹あり）
        99: "⛈", // 激しい雷雨（雹あり）
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
          {loading ? (<div style={{
              fontSize: "16px",
              fontWeight: "bold",
              animation: "fade-in 1s infinite alternate"
            }}>
              🌍 データ取得中...
            </div>
          ) :
          (       <div style={{
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
          </div>)
          }
        </div>
      )}
    </div>
  );
}