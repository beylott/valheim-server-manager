package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func ListModsHandler(modDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mods, err := ListMods(modDir)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		WriteJSON(w, mods)
	}
}

func UploadModHandler(modDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(10 << 20) // 10 MB max
		if err != nil {
			http.Error(w, "Cannot parse form", 400)
			return
		}

		file, header, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Missing file", 400)
			return
		}
		defer file.Close()

		err = SaveMod(modDir, header.Filename, file)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		w.WriteHeader(201)
	}
}

func DeleteModHandler(modDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		modname := chi.URLParam(r, "modname")
		err := DeleteMod(modDir, modname)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(204)
	}
}

func ListUsersHandler(configDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		users, admins, err := LoadUsers(configDir)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		WriteJSON(w, map[string][]string{
			"permitted": users,
			"admins":    admins,
		})
	}
}

func AddUserHandler(configDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Request struct {
			SteamID string `json:"steam_id"`
			Admin   bool   `json:"admin"`
		}

		var req Request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", 400)
			return
		}

		err := AddUser(configDir, req.SteamID, req.Admin)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		w.WriteHeader(201)
	}
}

func DeleteUserHandler(configDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		steamID := chi.URLParam(r, "steamid")
		err := RemoveUser(configDir, steamID)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		w.WriteHeader(204)
	}
}

func UpdateUsersHandler(configDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type Request struct {
			Permitted []string `json:"permitted"`
			Admins    []string `json:"admins"`
		}

		var req Request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", 400)
			return
		}

		err := SaveUsers(configDir, req.Permitted, req.Admins)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		w.WriteHeader(200)
	}
}
