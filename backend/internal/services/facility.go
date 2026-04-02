package services

import (
	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type FacilityService struct {
	db *gorm.DB
}

func NewFacilityService(db *gorm.DB) *FacilityService {
	return &FacilityService{db: db}
}

func (s *FacilityService) CreateFacility(facility *models.Facility) error {
	return s.db.Create(facility).Error
}

func (s *FacilityService) GetAllFacilities() ([]models.Facility, error) {
	var facilities []models.Facility
	err := s.db.Find(&facilities).Error
	return facilities, err
}

func (s *FacilityService) GetFacilityByID(id uint) (*models.Facility, error) {
	var facility models.Facility
	err := s.db.First(&facility, id).Error
	if err != nil {
		return nil, err
	}
	return &facility, nil
}

func (s *FacilityService) DeleteFacility(id uint) error {
	return s.db.Delete(&models.Facility{}, id).Error
}
