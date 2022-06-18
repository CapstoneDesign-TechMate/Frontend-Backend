from django.urls import path, include
from . import views
from rest_framework import urls

urlpatterns =[
    path('signup/', views.signup),
    path('auth/',include('rest_framework.urls')),
    path('login/', views.login),
    path('logout/', views.logout),
    path('check/', views.check_receipt),
    path('save/',views.save_receipt),
    path('date/',views.date_price),
    path('month/',views.month_price),
    path('total/',views.total_price),
    path('category/',views.get_category),
    path('reco/',views.recommend)
]
