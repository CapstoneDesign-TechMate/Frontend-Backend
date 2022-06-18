#from operator import ge
from .serializers import UserSerializer, ReceiptSerializer

from .models import User, Recipt
from .ML import getCate

#from rest_framework import generics
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import parser_classes
from django.http import JsonResponse
from .ocr import NAVER_OCR
import json

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

import base64

from .recommendation import recommendCafe, recommendByCategory, get_loc
# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny,])
def signup(request):
    if request.method == 'POST':
        if len(request.data["password"]) < 4:
            body = {"error": "Too short password.","status":"fail"}
            return JsonResponse(body, status=HTTP_400_BAD_REQUEST)
        try:
            if User.objects.filter(email=request.data['email']):
                return JsonResponse({"error":'Email already exist.', 'status' : 'fail'}, status=HTTP_400_BAD_REQUEST)
            if '@' not in request.data['email']:
                return JsonResponse({"error":'Not Email form.', 'status' : 'fail'}, status=HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=request.data['username']):
                return JsonResponse({"error":'Username already exist.', 'status' : 'fail'}, status=HTTP_400_BAD_REQUEST)
        except Exception:
            pass

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            #DB에 저장
            user = serializer.save()
            return JsonResponse({'user_id': user.id, "status":"success"}, status=HTTP_200_OK)
        return JsonResponse(serializer.errors, status=HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny,])
def login(request):
    email = request.data.get('email')
    username = request.data.get('username')
    password = request.data.get('password')

    if username is None or password is None:
        return JsonResponse({'error': 'Please provide password, email', 'status' : 'fail'}, status = 400)
    
    user = authenticate(password=password, username=username)

    if user is None:
        return JsonResponse({"error": 'Wrong user data', 'status' : 'fail'}, status = 400)
    try:
        token = Token.objects.create(user=user)
    except Exception:
        Token.objects.get(user=user).delete()
        token = Token.objects.create(user=user)

    return JsonResponse({'token': token.key, 'user_id': user.id,"status":"success", 'data': [{'email':email}]}, status=200)

@csrf_exempt
@permission_classes([AllowAny,])
@api_view(['POST'])
def logout(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username= username, password=password)
    
    if not user:
        return JsonResponse({'message': 'Invalid credentials', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    
    user_token = request.auth
    user_token.delete()
    return JsonResponse({'message': 'Token delete success','status':'success'}, status=200)


@api_view(["POST"])
def check_receipt(requests):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    

    img_file = requests.FILES['file']
    #img64 = base64.b64encode(img_file.read())
    user = requests.user
    result = NAVER_OCR(img_file)
    result_data = json.loads(result)
    print(result_data)
    if result_data['images'][0]['inferResult'] == 'ERROR':
        return JsonResponse({'message' : "Error", 'status':'fail'})
    head = result_data['images'][0]['receipt']['result']

    data = {'user_id' : user.id}
    data['store_name'] = head['storeInfo']['name']['formatted']['value']
    data['location'] = head['storeInfo']['addresses'][0]['formatted']['value']
    data['tel'] = head['storeInfo']['tel'][0]['formatted']['value']
    data['price'] = head['totalPrice']['price']['formatted']['value']

    date = head['paymentInfo']['date']['formatted']
    data['year'] = date['year']
    data['month'] = date['month']
    data['day'] = date['day']

    if len(head['subResults']) > 0:
        data['items'] = []
        for i in head['subResults'][0]['items']:
            data['items'].append(i['name']['formatted']['value'])

    return JsonResponse({'data':data, 'status':'success'})
    
@api_view(['POST'])
def save_receipt(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    user = request.user
    condtions = {'user_id' : user.id}
    if 'location' in request.data:
        condtions['location'] = request.data.get('location')
    else:
        return JsonResponse({'message': 'plz giv me location info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    if 'price' in request.data:
        condtions['price'] = request.data.get('price')
    else:
        return JsonResponse({'message': 'plz giv me price info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    if 'year' in request.data:
        condtions['year'] = request.data.get('year')
    else:
        return JsonResponse({'message': 'plz giv me year info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    if 'month' in request.data:
        condtions['month'] = request.data.get('month')
    else:
        return JsonResponse({'message': 'plz giv me month info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    if 'day' in request.data:
        condtions['day'] = request.data.get('day')
    else:
        return JsonResponse({'message': 'plz giv me day info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)
    if 'name' in request.data:
        condtions['name'] = request.data.get('name')
    else:
        return JsonResponse({'message': 'plz giv me store name info', 'status': 'fail'}, status=HTTP_400_BAD_REQUEST)

##################################################진우 ML 여기서 사용############################################
    if 'items' in request.data.keys():
        menu = request.data.get('items')
    else:
        menu = {}
    
    category = getCate(request.data.get('name'), request.data.get('price'), menu)
    print(category)
    
    receipt_serializer = ReceiptSerializer(data = condtions)
    if receipt_serializer.is_valid():
        #DB에 저장
        receipt = receipt_serializer.save()
        print("re : ", end = '')
        print(receipt.id)
        tmp = Recipt.objects.get(pk = receipt.id)
        for i in category.keys():
            if i == "한식":
                tmp.ko = category[i]
            elif i == "일식":
                tmp.ja = category[i]
            elif i == "양식":
                tmp.en = category[i]
            elif i == "중식":
                tmp.ch = category[i]
            elif i == "주류":
                tmp.dr = category[i]
            elif i == "카페/음료/디저트":
                tmp.de = category[i]
            elif i == "편의점/마트/잡화":
                tmp.ma = category[i]
            elif i == "유흥/여가":
                tmp.joy = category[i]
            elif i == "쇼핑":
                tmp.shop = category[i]
            elif i == "기타":
                tmp.etc = category[i]
        tmp.save()
        return JsonResponse({'receipt_id': receipt.id, "status":"success"}, status=HTTP_200_OK)
    return JsonResponse(receipt_serializer.errors, status=HTTP_400_BAD_REQUEST)

#주어진 날짜에 소비 내역 전부 보내줌

@api_view(['POST'])
def date_price(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    user = request.user
    condtions = {'user_id' : user.id}
    if 'year' in request.data:
        condtions['year'] = request.data.get('year')

    if 'month' in request.data:
        condtions['month'] = request.data.get('month')

    if 'day' in request.data:
        condtions['day'] = request.data.get('day')

    query_set = list(Recipt.objects.filter(**condtions).values())

    return JsonResponse({'list': query_set, 'status':'success'})

#주어진 년도에 해당하는 월별 소비 총 합 보내줌
@api_view(['POST'])
def month_price(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    user = request.user
    if 'year' in request.data:
        query_set = Recipt.objects.filter(user_id = user.id, year = request.data.get('year'))
    else:
        JsonResponse({'message':'년도 입력 하세요 제발', 'status': 'fail'})

    data = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,'status':'success'}
    for i in query_set:
        data[i.month] += i.price
    
    return JsonResponse(data)

#user_id에 해당하는 모든 영수증 데이터 넘겨줌
@api_view(['GET'])
def total_price(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    user = request.user
    query_set = list(Recipt.objects.filter(user_id = user.id).values())

    return JsonResponse({'data':query_set, 'status':'success'})

@api_view(['GET'])
def get_category(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    user = request.user
    query_set = Recipt.objects.filter(user_id = user.id)

    category = {'ko':0,'en':0,'ja':0,'ch':0,'dr':0,'de':0,'joy':0,'mt':0,'shop':0,'etc':0}

    for i in query_set:
        category['ko'] += i.ko
        category['en'] += i.en
        category['ja'] += i.ja
        category['ch'] += i.ja
        category['dr'] += i.dr
        category['de'] += i.de
        category['joy'] += i.joy
        category['shop'] += i.shop
        category['mt'] += i.mt
        category['etc'] += i.etc

    return JsonResponse({'data':category, 'status':'success'})
    
    
@api_view(['POST'])
def recommend(request):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    print(request.user.id)
    user = request.user
    print("request data : ")
    print(request.data)
    la = request.data['la']
    lo = request.data['lo']
    print("la : {}\nlo : {}".format(la, lo))
    location_json = get_loc(la, lo)
    print("loc_jaon :",end='') 
    print(location_json)
    location = json.loads(location_json.text)
    print(location)
    loc_name = location['documents'][0]['address_name']
    print(loc_name)
    query_set = Recipt.objects.filter(user_id = user.id)

    category = {'ko':0,'en':0,'ja':0,'ch':0,'dr':0,'de':0}
    for i in query_set:
        category['ko'] += i.ko
        category['en'] += i.en
        category['ja'] += i.ja
        category['ch'] += i.ch
        category['dr'] += i.dr
        category['de'] += i.de

    max_cate = max(category, key=category.get)
    
    if max_cate == "de":
        #name, img_src, address = 
        tmp = recommendCafe(loc_name)
        print(tmp)
        name = tmp[0]
        img_src = tmp[1]
        address = tmp[2]
    else:
        if max_cate == "ko":
            cate = "한식"
        elif max_cate == "ja":
            cate = "일식"
        elif max_cate == "en":
            cate = "양식"
        elif max_cate == "ch":
            cate = "중식"
        elif max_cate == "dr":
            cate = "주류"
        
        #name, img_src, address = 
        tmp = recommendByCategory(cate,loc_name)
        name = tmp[0]
        img_src = tmp[1]
        address = tmp[2]
        print(tmp)
    return JsonResponse({'data':{'name':name, 'img':img_src, 'address':address},'status':'success'})







