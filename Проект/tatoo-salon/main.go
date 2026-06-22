package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type Booking struct {
	Name        string `json:"name"`
	Phone       string `json:"phone"`
	Description string `json:"description"`
	Style       string `json:"style"`
	Timestamp   string `json:"timestamp"`
}

func main() {
	fmt.Println("🚀 Сервер запущен! Открой http://localhost:8080")
	os.MkdirAll("data", 0755)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/api/booking", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Только POST", http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Ошибка чтения", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		var booking Booking
		if err := json.Unmarshal(body, &booking); err != nil {
			http.Error(w, "Неверный JSON", http.StatusBadRequest)
			return
		}

		booking.Timestamp = time.Now().Format("2006-01-02 15:04:05")
		filename := "data/booking_" + time.Now().Format("20060102_150405") + ".txt"
		content := "Имя: " + booking.Name + "\nТелефон: " + booking.Phone + "\nОписание: " + booking.Description + "\nСтиль: " + booking.Style + "\nВремя: " + booking.Timestamp + "\n"
		os.WriteFile(filename, []byte(content), 0644)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"success"}`))
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	http.ListenAndServe(":8080", nil)
}