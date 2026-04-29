package api

import (
	"log"
	"net/http"
	"strconv"

	"encoding/json"

	"github.com/Gabo-div/bingo/inmijobs/backend-core/internal/core"
	"github.com/Gabo-div/bingo/inmijobs/backend-core/internal/dto"
	"github.com/Gabo-div/bingo/inmijobs/backend-core/internal/utils"
	"github.com/go-chi/chi/v5"
)

type PostHandler struct {
	svc         core.PostService
	authService core.AuthService
}

func NewPostHandler(svc core.PostService, as core.AuthService) *PostHandler {
	return &PostHandler{
		svc:         svc,
		authService: as,
	}
}

func (h *PostHandler) EditPost(w http.ResponseWriter, r *http.Request) {

	var input dto.CreatePostRequest

	Postid := chi.URLParam(r, "id")
	if Postid == "" {
		utils.RespondError(w, http.StatusBadRequest, "Missing post ID")
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	updatedPost, err := h.svc.UpdatePost(r.Context(), Postid, input)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to create post: "+err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, updatedPost)
}

func (p PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	user, err := p.authService.UserFromHeader(r.Context(), r.Header)
	if err != nil {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req dto.CreatePostRequest
	if user.Email == "invitado@inmijobs.com" {
		utils.RespondError(w, http.StatusForbidden, "Los invitados no pueden crear posts")
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	req.UserID = user.ID
	createdPost, err := p.svc.CreatePost(r.Context(), req)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to create post")
		return
	}

	utils.RespondJSON(w, http.StatusOK, createdPost)
}

func (h *PostHandler) GetByID(w http.ResponseWriter, r *http.Request) {

	Postid := chi.URLParam(r, "id")
	if Postid == "" {
		utils.RespondError(w, http.StatusBadRequest, "Missing post ID")
		return
	}

	post, err := h.svc.GetByID(r.Context(), Postid)
	if err != nil {

		if err.Error() == "Post doesn't exist or not found" {
			utils.RespondError(w, http.StatusNotFound, err.Error())
		} else {
			utils.RespondError(w, http.StatusInternalServerError, "Internal server error")
		}
		return
	}

	utils.RespondJSON(w, http.StatusOK, post)
}

func (p PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {

	_, err := p.authService.UserFromHeader(r.Context(), r.Header)
	if err != nil {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	Postid := chi.URLParam(r, "id")
	if Postid == "" {
		utils.RespondError(w, http.StatusBadRequest, "Missing post ID")
		return
	}

	post, err := p.svc.DeletePost(r.Context(), Postid)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Post deleted successfully",
		"post":    post,
	})
}

func (p PostHandler) GetFeed(w http.ResponseWriter, r *http.Request) {

	user, err := p.authService.UserFromHeader(r.Context(), r.Header)
	if err != nil {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	query := r.URL.Query()
	limit, err := strconv.Atoi(query.Get("limit"))
	if err != nil {
		log.Println(err)
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	cursor := query.Get("cursor")

	posts, cur, err := p.svc.GetFeed(r.Context(), user.ID, limit, cursor)

	if err != nil {
		log.Println(err)
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"message":     "User feed retrieved successfully",
		"post":        posts,
		"next_cursor": cur,
	})
}

func (p PostHandler) GetUserImages(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userId")
	if userID == "" {
		utils.RespondError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	images, err := p.svc.GetImagesByUserID(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to get user images")
		return
	}

	utils.RespondJSON(w, http.StatusOK, dto.UserImagesResponse{Images: images})
}
