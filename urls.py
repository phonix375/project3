from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('login',views.login, name='login'),
    path('menu',views.menu, name='menu'),
    path('loginSend', views.login_view, name='loginSend'),
    path('logout',views.logout_view, name='logout'),
    path('register',views.register, name='register'),
    path('gettopings',views.gettopings, name='gettopings'),
    path('order',views.order, name='order')
]