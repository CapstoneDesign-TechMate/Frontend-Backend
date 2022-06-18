
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.forms import CharField

# Create your models here.

class UserManager(BaseUserManager):
    def createUser(self, email, username, password=None):
        if not email:
            raise ValueError('Must have user email')
        
        if not username:
            raise ValueError('Must have user username')
        user = User(
            email = self.normalize_email(email),
            username = username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        if not email:
            raise ValueError('Must have user email')
        if not username:
            raise ValueError('Must have user username')
        user = User(
            email = self.normalize_email(email),
            username = username
        )
        user.is_admin = True
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(default='',max_length = 100,null=False,blank = False,unique=True)
    email = models.CharField(default='', max_length = 100, null = False, blank =False, unique=True)

    is_active = models.BooleanField(default = True)
    is_admin = models.BooleanField(default = False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class ReceiptManager(models.Manager):
    def createReceipt(self, data):
        print(data)
        receipt = Recipt(
            user_id = data['user_id'],
            location = data['location'],
            price = data['price'],
            year = data['year'],
            month = data['month'],
            day = data['day'],
            name = data['name'],
        )
        receipt.save(using=self._db)
        return receipt

class Recipt(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 100, default="",null=False,blank=False)
    price = models.IntegerField(null=False,blank = False)
    location = models.CharField(max_length=100,null=False)

    year = models.IntegerField(null=False,blank = False)
    month = models.IntegerField(null=False,blank = False)
    day = models.IntegerField(null=False,blank = False)

    user_id = models.ForeignKey('accounts.user',related_name="user", on_delete=models.CASCADE, db_column="user_id")

    
    ko = models.IntegerField(default = 0, null=False,blank = False)
    en = models.IntegerField(default = 0, null=False,blank = False)
    ja = models.IntegerField(default = 0, null=False,blank = False)
    ch = models.IntegerField(default = 0, null=False,blank = False)
    dr = models.IntegerField(default = 0, null=False,blank = False)
    de = models.IntegerField(default = 0, null=False,blank = False)
    joy = models.IntegerField(default = 0,null=False,blank=False)
    mt = models.IntegerField(default=0,null=False,blank=False)
    shop = models.IntegerField(default=0,null=False,blank=False)
    etc = models.IntegerField(default=0,null=False,blank=False)

    
    objects = ReceiptManager()

    USERNAME_FIELD = 'location'
    REQUIRED_FIELDS = ['year','month','day', 'price']

    def __str__(self):
        return self.id
