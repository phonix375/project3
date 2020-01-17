from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class menuItem(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField(blank=False)
    toping = models.IntegerField(default=0)
    large = models.FloatField(default=0)
    category = models.CharField(max_length=64, default='none')

    def __str__(self):
        return f'id : {self.id}, item name : {self.name}, item price: {self.price}, toping :{self.toping} category :{self.category}'

class Topings(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField(default=0.50)
    toping = models.IntegerField(default=0)
    menuItem = models.ManyToManyField(menuItem,blank=True, related_name='items')

    def __str__(self):
        return f'{self.name}'

class orderItem(models.Model):
    item = models.ForeignKey(menuItem,on_delete=models.CASCADE)
    size = models.CharField(max_length=64)
    topings = models.ManyToManyField(Topings)

    def __str__(self):
        return f'id : {self.id}, item : {self.item} size : {self.size}, topings : {self.topings.all()}'


class orders(models.Model):
    user = models.CharField(max_length=64, default='none')
    orderItems = models.ManyToManyField(to=orderItem)
    status = models.CharField(default='panding',max_length=30)


    def __str__(self):
        return f'id: {self.id} user : {self.user}, order items :{self.orderItems} '


