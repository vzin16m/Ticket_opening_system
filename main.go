package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Technician struct {
	Name string `json:"name"`
	CPF  string `gorm:"primaryKey" json:"cpf"`
}

type Ticket struct {
	ID          string     `gorm:"primaryKey"`
	Description string     `json:"description"`
	Status      string     `json:"status"`
	technician  Technician `gorm:"foreignKey:CPF"`
}

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	//ctx := context.Background()
	//tx := db.WithContext(ctx)
	db.AutoMigrate(&Technician{}, &Ticket{})
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		var tec []Technician
		query := db.Find(&tec)
		if query.Error != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tec)
	})

	r.Post("/", func(w http.ResponseWriter, r *http.Request) {

		var tec Technician
		body := json.NewDecoder(r.Body).Decode(&tec)

		if body != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		db.Create(&tec)
	})

	r.Delete("/{cpf}", func(w http.ResponseWriter, r *http.Request) {
		var tec Technician
		url := chi.URLParam(r, "cpf")
		query := db.Where("cpf = ?", url)

		if query.Error != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		query.Delete(&tec)
	})

	http.ListenAndServe(":3000", r)
}
