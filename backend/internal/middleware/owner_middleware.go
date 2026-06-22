package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)



func OwnerOrAdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		if role != "admin" && role != "owner" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Owner or admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}
