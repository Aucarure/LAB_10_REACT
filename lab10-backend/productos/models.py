from django.db import models

class Producto(models.Model):
    codigo = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.descripcion
    
    class Meta:
        db_table = 'productos'