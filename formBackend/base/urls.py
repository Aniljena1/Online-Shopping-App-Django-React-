from django.urls import path
from base import views
from rest_framework_simplejwt.views import TokenObtainPairView



urlpatterns = [

    path('user/register/', views.registerUser, name='register'),
    path('user/profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('users/', views.getUsers, name='users'),
    path('user/delete/<str:pk>/', views.deleteUser, name='delete-user'),
    path('user/get/<str:pk>/', views.getUserById, name='user'),
    path('user/update/<str:pk>/', views.updateUser, name='update-user'),
    path('products/top/', views.getTopProducts, name='top-products'),
    path('products/', views.getProducts, name='products'),
    path('product/<str:pk>/', views.getSingleProducts, name='product'),
    path('products/delete/<str:pk>/', views.deleteProducts, name='delete-products'),
    path('products/create/', views.createProducts, name='create-products'),
    path('products/upload/', views.uploadImage, name='image-upload'),
    path('products/update/<str:pk>/', views.updateProduct, name='update-products'),
    path('products/review/<str:pk>/', views.createProductReview, name='products-review'),
    path('add/', views.addOrderItem, name='orders-add'),
    path('order/<str:pk>/', views.getOrderById, name='user-order'),
    path('myorders/', views.getMyOrder, name='myorders'),
    path('orders/', views.getOrder, name='orders'),
    path('order/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('order/<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]

