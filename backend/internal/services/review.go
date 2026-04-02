package services

import (
	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type ReviewService struct {
	db *gorm.DB
}

func NewReviewService(db *gorm.DB) *ReviewService {
	return &ReviewService{db: db}
}

func (s *ReviewService) CreateReview(review *models.Review) error {
	return s.db.Create(review).Error
}

func (s *ReviewService) GetReviewByID(id uint) (*models.Review, error) {
	var review models.Review
	err := s.db.First(&review, id).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (s *ReviewService) GetReviewsByKosID(kosID uint) ([]models.Review, error) {
	var reviews []models.Review
	err := s.db.Where("kos_id = ?", kosID).Preload("User", "id, name").Order("created_at DESC").Find(&reviews).Error
	return reviews, err
}

func (s *ReviewService) UpdateReview(review *models.Review) error {
	return s.db.Save(review).Error
}

func (s *ReviewService) DeleteReview(id uint) error {
	return s.db.Delete(&models.Review{}, id).Error
}
