package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

func main() {
	r := chi.NewRouter()

	modDir := os.Getenv("MOD_DIR")
	if modDir == "" {
		log.Fatal("MOD_DIR environment variable not set")
	}

	r.Get("/mods", ListModsHandler(modDir))
	r.Post("/mods", UploadModHandler(modDir))
	r.Delete("/mods/{modname}", DeleteModHandler(modDir))

	r.Get("/users", ListUsersHandler("/config"))
	r.Post("/users", AddUserHandler("/config"))
	r.Delete("/users/{steamid}", DeleteUserHandler("/config"))
	r.Put("/users", UpdateUsersHandler("/config"))

	// Serve static frontend
	r.Handle("/*", http.FileServer(http.Dir("/var/www")))

	log.Println("Starting Mod Manager on :8080")
	http.ListenAndServe(":8080", r)
}
