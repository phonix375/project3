from django.contrib import admin
from .models import  menuItem, Topings, orders,orderItem
# Register your models here.

admin.site.register(menuItem)
admin.site.register(Topings)
admin.site.register(orders)
admin.site.register(orderItem)