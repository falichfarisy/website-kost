package services

import (
	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type FavoriteService struct {
	db *gorm.DB
}

func NewFavoriteService(db *gorm.DB) *FavoriteService {
	return &FavoriteService{db: db}
}

func (s *FavoriteService) AddFavorite(favorite *models.Favorite) error {
	return s.db.Create(favorite).Error
}

func (s *FavoriteService) RemoveFavorite(userID, kosID uint) error {
	return s.db.Where("user_id = ? AND kos_id = ?", userID, kosID).Delete(&models.Favorite{}).Error
}

func (s *FavoriteService) GetFavoritesByUserID(userID uint) ([]models.Kos, error) {
	var kosList []models.Kos
	err := s.db.Table("favorites").
		Select("kos.*").
		Joins("JOIN kos ON kos.id = favorites.kos_id").
		Where("favorites.user_id = ?", userID).
		Preload("Facilities").
		Preload("Images").
		Find(&kosList).Error
	return kosList, err
}

func (s *FavoriteService) IsFavorite(userID, kosID uint) bool {
	var count int64
	s.db.Model(&models.Favorite{}).Where("user_id = ? AND kos_id = ?", userID, kosID).Count(&count)
	return count > 0
}
