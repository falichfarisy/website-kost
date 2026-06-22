package services

import (
	"gorm.io/gorm"
	"kose-backend/internal/models"
)

type KosService struct {
	db *gorm.DB
}

func NewKosService(db *gorm.DB) *KosService {
	return &KosService{db: db}
}

func (s *KosService) CreateKos(kos *models.Kos) error {
	return s.db.Create(kos).Error
}

func (s *KosService) GetKosByID(id uint) (*models.Kos, error) {
	var kos models.Kos
	err := s.db.Preload("Facilities").Preload("Images").First(&kos, id).Error
	if err != nil {
		return nil, err
	}
	return &kos, nil
}

func (s *KosService) GetAllKos(filters models.KosFilters) ([]models.Kos, int64, error) {
	var kosList []models.Kos
	var total int64

	query := s.db.Model(&models.Kos{}).Where("available_rooms > 0")

	if filters.MinPrice > 0 {
		query = query.Where("kos.price >= ?", filters.MinPrice)
	}
	if filters.MaxPrice > 0 {
		query = query.Where("kos.price <= ?", filters.MaxPrice)
	}
	if filters.KosType != "" {
		query = query.Where("kos.kos_type = ?", filters.KosType)
	}
	if filters.MinRating > 0 {
		query = query.Where("kos.rating >= ?", filters.MinRating)
	}
	if filters.Search != "" {
		query = query.Where("kos.name ILIKE ? OR kos.address ILIKE ?", "%"+filters.Search+"%", "%"+filters.Search+"%")
	}
	if filters.Facility != "" {
		query = query.Joins("JOIN kos_facilities ON kos_facilities.kos_id = kos.id").
			Joins("JOIN facilities ON facilities.id = kos_facilities.facility_id").
			Where("facilities.name ILIKE ?", "%"+filters.Facility+"%")
	}

	query.Count(&total)

	offset := (filters.Page - 1) * filters.Limit
	err := query.Preload("Facilities").Preload("Images").
		Order("rating DESC, created_at DESC").
		Limit(filters.Limit).Offset(offset).
		Find(&kosList).Error

	return kosList, total, err
}

func (s *KosService) SearchKos(query string) ([]models.Kos, error) {
	var kosList []models.Kos
	err := s.db.Where("name ILIKE ? OR address ILIKE ?", "%"+query+"%", "%"+query+"%").
		Preload("Facilities").Preload("Images").
		Limit(20).
		Find(&kosList).Error
	return kosList, err
}

func (s *KosService) UpdateKos(kos *models.Kos) error {
	return s.db.Save(kos).Error
}

func (s *KosService) DeleteKos(id uint) error {
	return s.db.Delete(&models.Kos{}, id).Error
}

func (s *KosService) UpdateRating(kosID uint) error {
	var result struct {
		AvgRating float64
		Count     int64
	}

	s.db.Model(&models.Review{}).Where("kos_id = ?", kosID).
		Select("AVG(rating) as avg_rating, COUNT(*) as count").
		Scan(&result)

	return s.db.Model(&models.Kos{}).Where("id = ?", kosID).
		Updates(map[string]interface{}{
			"rating":       result.AvgRating,
			"review_count": result.Count,
		}).Error
}

func (s *KosService) AddFacility(kosID uint, facilityID uint) error {
	return s.db.Exec("INSERT INTO kos_facilities (kos_id, facility_id) VALUES (?, ?)", kosID, facilityID).Error
}

func (s *KosService) RemoveFacility(kosID uint, facilityID uint) error {
	return s.db.Exec("DELETE FROM kos_facilities WHERE kos_id = ? AND facility_id = ?", kosID, facilityID).Error
}

func (s *KosService) SetFacilities(kosID uint, facilityIDs []uint) error {
	tx := s.db.Begin()
	if err := tx.Exec("DELETE FROM kos_facilities WHERE kos_id = ?", kosID).Error; err != nil {
		tx.Rollback()
		return err
	}
	for _, fid := range facilityIDs {
		if err := tx.Exec("INSERT INTO kos_facilities (kos_id, facility_id) VALUES (?, ?)", kosID, fid).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit().Error
}
