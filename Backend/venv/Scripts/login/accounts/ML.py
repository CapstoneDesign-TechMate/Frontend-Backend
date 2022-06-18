# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC #selenium에서 사용할 모듈 import
from webdriver_manager.chrome import ChromeDriverManager
from gensim import models
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report
from sklearn.ensemble import RandomForestClassifier
import operator
import numpy as np
import os
import csv
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import time
import requests
import re

from pyvirtualdisplay import Display

food_category = {'양식', '떡볶이', '찜닭', '양갈비', '관광농원,팜스테이', '해장국', '오징어요리', '찐빵', '만두', '닭볶음탕', '호떡', '라면', '육류,고기요리', '피자', '이북음식', '한식', '게요리', '감자탕', '생선회', '족발,보쌈', '조개요리', '햄버거', '101번지남산돈까스', '우동,소바', '곰탕,설렁탕', '이탈리아음식', '핫도그', '패밀리레스토랑', '샤브샤브', '프랑스음식', '오리요리', '생선구이', '해물,생선요리', '보리밥', '다이어트,샐러드', '전,빈대떡', '매운탕,해물탕', '맥주,호프', '요리주점', '문어부인삼교비', '와인', '순대,순댓국', '태국음식', '분식', '바닷가재요리', '베이커리', '일본식라면', '도시락,컵밥', '두부요리', '치킨,닭강정', '곱창,막창,양', '떡,한과', '스테이크,립', '전복요리', '백반,가정식', '스페인음식', '찌개,전골', '국밥', '도넛', '양꼬치', '카레', '아귀찜,해물찜', '돈가스', '쌈밥', '전통,민속주점', '소고기구이', '물고기자리', '토스트', '김밥', '딤섬,중식만두', '복어요리', '72420', '베트남음식', '한정식', '술집', '주꾸미요리', '바(BAR)', '향토음식', '일식당', '브런치', '닭요리', '케이크전문', '낙지요리', '백숙,삼계탕', '밀도', '닭발', '닭갈비', '커피번', '덮밥', '인도음식', '베이글', '칼국수,만두', '국수', '샌드위치', '퓨전음식', '스파게티,파스타전문','잔잔', '장어,먹장어요리', '멕시코,남미음식', '빙수', '갈비탕', '일식,초밥뷔페', '고기뷔페', '비빔밥', '일식튀김,꼬치', '종합분식', '돼지고기구이', '바나프레소', '이자카야', '중식당', '떡카페', '포장마차', '막국수', '냉면', '초밥,롤', '오뎅,꼬치', '아시아음식', '정육식당', '해산물뷔페', '테마공원', '대게요리', '뷔페', '독일음식', '아이스크림'}
cafe_category = ['과일,주스전문점', '홍차전문점', '카페,디저트', '차', '장소대여', '테마카페', '스터디카페', '초콜릿전문점', '바나프레소', '아이스크림', '베이커리', '카페', '갤러리카페', '케이크전문', '테이크아웃커피', '와플']
ko_category = {'떡볶이', '찜닭', '양갈비', '관광농원,팜스테이', '해장국', '오징어요리', '찐빵', '만두', '닭볶음탕', '호떡', '라면', '육류,고기요리', '이북음식', '한식', '게요리', '감자탕', '족발,보쌈', '곰탕,설렁탕', '샤브샤브', '오리요리', '생선구이', '보리밥', '전,빈대떡', '요리주점', '문어부인삼교비', '순대,순댓국', '태국음식', '분식', '도시락,컵밥', '두부요리', '곱창,막창,양', '떡,한과', '전복요리', '백반,가정식', '찌개,전골', '국밥', '카레', '아귀찜,해물찜', '쌈밥', '소고기구이', '토스트', '김밥', '베트남음식', '한정식', '주꾸미요리', '향토음식', '닭요리', '낙지요리', '백숙,삼계탕', '밀도', '닭발', '닭갈비', '덮밥', '인도음식', '칼국수,만두', '국수', '장어,먹장어요리', '갈비탕', '고기뷔페', '비빔밥', '종합분식', '돼지고기구이', '막국수', '냉면', '오뎅,꼬치', '아시아음식', '정육식당', '테마공원', '뷔페',  }
ja_category = {'생선회', '조개요리', '우동,소바', '해물,생선요리', '매운탕,해물탕', '바닷가재요리', '일본식라면', '물고기자리', '복어요리', '일식당', '일식,초밥뷔페', '일식튀김,꼬치', '초밥,롤', '해산물뷔페', '대게요리',     }
en_category = {'양식', '피자', '햄버거', '101번지남산돈까스', '이탈리아음식', '핫도그', '패밀리레스토랑', '프랑스음식', '다이어트,샐러드', '치킨,닭강정', '스테이크,립', '스페인음식', '돈가스', '퓨전음식', '스파게티,파스타전문', '멕시코,남미음식', '독일음식', }
ch_category = {'양꼬치', '중식당', '딤섬,중식만두', }
dr_category = {'맥주,호프', '와인', '전통,민속주점', '술집', '바(BAR)', '잔잔', '이자카야', '포장마차',   }
de_category = {'베이커리', '도넛', '브런치', '케이크전문', '커피번', '베이글', '샌드위치', '빙수', '바나프레소', '떡카페', '아이스크림' , '과일,주스전문점', '홍차전문점', '카페,디저트', '차', '장소대여', '테마카페', '스터디카페', '초콜릿전문점', '카페', '갤러리카페', '케이크전문', '테이크아웃커피', '와플' }
convenience_category=['편의점', '마트', '잡화', '슈퍼,마트']
play_category=['노래방', 'PC방', 'DVD방', '오락실', '방탈출카페', '보드카페','영화관']
shopping_category=['보세의류', '캐주얼웨어', '여성의류', '구제의류', '패션', '정장', '유아동복', '수입의류', '신발', '가방,핸드백', '시계', '백화점']

def preProcessing(text) :
  text = text.replace(" ","")
  regex = "\(.*\)|\s-\s.*"
  text = re.sub(regex,'',text)
  for idx,x in enumerate(text) :
    if x == '+' or x == '-' or x == '_' or x == '/' :
      text = text[:idx]
      break
  return text

def getCategorybyTitle(title):
    if title == "":
        return "No title"
    
    display = Display(visible=0, size=(1024, 768))
    display.start()
    path = r"/home/ubuntu/chromedriver"
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    #chrome_options.add_argument('--no-sandbox')
    #chrome_options.add_argument("--single-process")
    #chrome_options.add_argument("--disable-dev-shm-usage")
    #chrome_options.add_argument('user-agent={0}'.format(user_agent))
    driver = webdriver.Chrome(path, options=chrome_options)
    print(driver.capabilities['browserVersion'])
    driver.get("https://map.naver.com/v5/")
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "input_search"))
        )  # 입력창이 뜰 때까지 대기
    except TimeoutException:
        print("타임아웃")
        return "ERROR1"
    finally:
        pass
    time.sleep(2)
    search_box = driver.find_element_by_class_name("input_search")
    print("search box : ", search_box)
    search_box.send_keys(title)
    search_box.send_keys(Keys.ENTER)

    time.sleep(2)  # 화면 표시 기다리기
    frame = driver.find_element_by_css_selector("iframe#searchIframe")
    driver.switch_to.frame(frame)

    time.sleep(2.5)
    print("frame : ",frame)
    # iframe 전환
    
    category = ""
    flag = 0
    time.sleep(1.5)
    try :
        places_box_className = driver.find_element_by_xpath(
                    "/html/body/div[3]/div/div[2]/div[1]/ul/li[1]").get_attribute('class').replace(
                    " ", ".")  # 장소 정보가 들어있는 아이템(li) class명 수집
    except :
        try :
            places_box_className = driver.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]/ul/li[1]").get_attribute('class').replace(" ", ".")
        except : 
            return "No names"
    stores = driver.find_elements_by_css_selector(
                "li."+places_box_className)
    #stores = driver.find_elements_by_css_selector(
    #    "#_pcmap_list_scroll_container > ul > li > div._3ZU00._1rBq3 > a > div > div")

    if stores == []:
        return "ERROR1"
        #try:
        #    stores = driver.find_elements_by_css_selector(
        #        "#_pcmap_list_scroll_container > ul > li > div._3hn9q > a > div.O9Z-o > div")
        #    flag = 1
        #except:
        #    return "No Stores"
    print("stores :" , stores)
    
    name = stores[0].find_element_by_css_selector(
                    "div>span").text  #가게 이름
    try:
        click_name = stores[0].find_element_by_css_selector(
                        "div>span").click() ##상세 정보창으로 이동, 오류시 반복문 종료
    except:
        return "ERROR2"
    driver.switch_to.default_content()
    time.sleep(1)
    ##switch_to.default_content()로 전환해야 frame_in iframe을 제대로 잡을 수 있다.

    frame_in = driver.find_element_by_css_selector('iframe#entryIframe')  # 장소 세부

    driver.switch_to.frame(frame_in)
    # 가게 이름을 클릭하면 나오는 세부 정보 iframe으로 이동
    time.sleep(3)

    try:
        category = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[2]/div[1]/div[1]/span[2]").text
    except:
        category = ''

    if category in ko_category:
        return "한식"
    elif category in ja_category:
        return "일식"
    elif category in en_category:
        return "양식"
    elif category in ch_category:
        return "중식"
    elif category in dr_category:
        return "주류"
    elif category in de_category:
        return "카페/음료/디저트"
    elif category in convenience_category:
        return "펀의점/마트/잡화"
    elif category in play_category:
        return "유흥/여가"
    elif category in shopping_category:
        return "쇼핑"
    else:
        return "기타"

def readCsv() :
    print("in readCsv")
    f = open('/srv/Backend/venv/Scripts/login/accounts/ML/메뉴정보_괄호제거.csv', 'r', encoding='UTF-8')
    data = csv.reader(f, delimiter=',')
    header = next(data)  # 첫 번째 줄 -> 불필요한 정보니 없앰
    x = []
    y = []
    temp = []
    i = 0
    for row in data:
        if row[1] == "":
            #print(i)
            break
        # if row[1] == '한식' :
        #  if i%6 != 0:
        #    i+=1
        #    continue
        menu = row[0].split(" ")[0]
        temp.append(menu)
        x.append(ko_model.wv.get_vector(menu))
        y.append(row[1])
        i += 1
    f.close()
    return x,y,temp
# Press the green button in the gutter to run the script.
def getCate(name,total_price,menuDict) :
    w = 0.7
    print("name : {} price : {} menu : {}".format(name, total_price,menuDict))
    print("in getCate")
    cateName = getCategorybyTitle(name)
    # 만약 식비쪽이 아니다. 바로 return 해줌
    print("CateName : ", cateName)
    if cateName in ["No names","No stores","Error1", "Error2", "Error3", "Error4"]:
        print(cateName)
        return {"기타" : total_price}
    if menuDict == {}:
        return {cateName : total_price}
    if cateName in ["편의점/마트/잡화","유흥/여가","쇼핑", "기타"] :
        return {cateName : total_price}
    #만약 식비쪽이다
    scoreDict = {'한식' : 0, '양식' : 0, '중식' : 0, '일식' : 0, '카페/음료/디저트' : 0, '주류' : 0}
    checkList = []
    priceList = []
    for key, value in menuDict.items() :
        key = preProcessing(key) #menu text 전처리
        checkList.append(ko_model.wv.get_vector(key))
        priceList.append(value)
    checkList = np.array(checkList)
    cateList = classifier.predict(checkList) # category 예측
    priceSum = 0
    for idx,x in enumerate(cateList) :
      priceSum += priceList[idx]
      if x == '한식' :
        scoreDict['한식'] += priceList[idx]
      elif x == '양식' :
        scoreDict['양식'] += priceList[idx]
      elif x == '중식' :
        scoreDict['중식'] += priceList[idx]
      elif x == '일식' :
        scoreDict['일식'] += priceList[idx]
      elif x == '카페/음료/디저트' :
        scoreDict['카페/음료/디저트'] += priceList[idx]
      elif x == '주류' :
        scoreDict['주류'] += priceList[idx]
    scoreDict[cateName] += priceSum * w
    max_key = max(scoreDict.items(), key=operator.itemgetter(1))[0]
    return {max_key : total_price}

def loadModel() :
    ko_model = models.fasttext.load_facebook_model('/srv/Backend/venv/Scripts/login/accounts/ML/cc.ko.300.bin')
    return ko_model

def makeClassifier(x,y) :
    x_train, x_test, y_train, y_test = train_test_split(x,

                                                        y,

                                                        test_size=0.3,

                                                        shuffle=True,

                                                        random_state=1004)
    x = np.array(x)
    y = np.array(y)
    x_train = np.array(x_train)
    y_train = np.array(y_train)
    x_test = np.array(x_test)
    y_test = np.array(y_test)
    classifier = RandomForestClassifier(max_depth = 50 ,n_estimators=100, oob_score=True, random_state=123456)
    classifier.fit(x_train, y_train)  # fit메서드로 모델 학습
    return classifier

print("start model loading")
ko_model = loadModel()
print("step 1")
ML_x, ML_y, temp = readCsv()
print("step 2")
classifier = makeClassifier(ML_x, ML_y)
print("finish model loading")

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
