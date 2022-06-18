#!/usr/bin/env python
# coding: utf-8

# In[12]:


from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC #selenium에서 사용할 모듈 import
from webdriver_manager.chrome import ChromeDriverManager
import time
import requests
from bs4 import BeautifulSoup
import re
import csv
from pyvirtualdisplay import Display

# In[24]:


def recommendByCategory(category, loc) :
    print("loc : {}".format(loc))
    print("category : ", category)
    if category == "" :
        return "No category"
    display = Display(visible=0, size=(1024, 768))
    display.start()
    path = r"/home/ubuntu/chromedriver"
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(path, options=chrome_options)
    print(driver.capabilities['browserVersion'])
    driver.get("https://map.naver.com/v5/")

    time.sleep(2)
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "input_search"))
        ) #입력창이 뜰 때까지 대기
    except TimeoutException :
        print("타임아웃")
        return "ERROR"
    finally:
        pass
    if category == '주류' : category = '주점' 
    search_box = driver.find_element_by_class_name("input_search")
    search_box.send_keys(loc)
    time.sleep(2)
    search_box.send_keys(Keys.ENTER)
    search_box.clear()
    time.sleep(2)
    search_box.send_keys(category)
    search_box.send_keys(Keys.ENTER)


    time.sleep(2) #화면 표시 기다리기
    frame = driver.find_element_by_css_selector("iframe#searchIframe")

    driver.switch_to.frame(frame)
    
    time.sleep(2)
    try :
        scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[2]/div[1]")
    except :
        try :
            scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]")
        except : 
            try :
                scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[3]/div[1]")
            except :
                try :
                    scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div/div[1]")
                except :
                    try :
                        scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[0]/div[1]")
                    except :
                        return "Error1"
    print(scroll_div)
    driver.execute_script("arguments[0].scrollBy(0,2000)", scroll_div)
    
    category = ""
    final_result=[]
    flag = 0
    stores = driver.find_elements_by_css_selector("#_pcmap_list_scroll_container > ul > li")
    print(len(stores))
    for store in stores: #한 페이지 내에서의 반복문. 순차적으로 가게 정보에 접근
        #/html/body/div[3]/div/div[2]/div[1]/ul/li[1]/div[1]/a/div[1]/div/span
        #_pcmap_list_scroll_container > ul > li:nth-child(20) > div._3hn9q > a > div.O9Z-o > div > span.OXiLu
        try :
            name = store.find_element_by_css_selector("div._3hn9q > a > div.O9Z-o > div > span.OXiLu").text #가게 이름
             #_pcmap_list_scroll_container > ul > li:nth-child(3) > div._3hn9q > a > div._17H46 > span._2FqTn._1mRAM > em
            
        except :
            try :
                name = store.find_element_by_css_selector("div._3ZU00._1rBq3 > a > div > div > span._3Apve").text #가게 이름
                #_pcmap_list_scroll_container > ul > li:nth-child(7) > div._3ZU00._1rBq3 > a:nth-child(1) > div > div > span._3Apve
            except :
                try :
                    name = store.find_element_by_css_selector("div._3ZU00 > a > div > div > span._3Apve").text #가게 이름
                    #_pcmap_list_scroll_container > ul > li:nth-child(6) > div._3ZU00 > a:nth-child(1) > div > div > span._3Apve
                except : return "Error2"
                
        try : 
            rating = store.find_element_by_css_selector("div._3hn9q > a > div._17H46 > span._2FqTn._1mRAM > em").text
            #rating =  re.search('/span>(\d).', store.find_element_by_css_selector("span._2FqTn._1mRAM").get_attribute('innerHTML')).groups()[0]
            #_pcmap_list_scroll_container > ul > li:nth-child(2) > div._3hn9q > a > div._17H46 > span._2FqTn._1mRAM > em
        except : continue
        #_pcmap_list_scroll_container > ul > li:nth-child(3) > div.zZGuI > div > a:nth-child(1) > div > div
        #_pcmap_list_scroll_container > ul > li:nth-child(2) > div.zZGuI > div > a > div > div
        try : 
            img_src = re.search('url[(]"([\S]+)"', store.find_element_by_css_selector("div.zZGuI > div > a > div > div").get_attribute('style')).groups()[0]
        except : continue
        #_pcmap_list_scroll_container > ul > li > div._3hn9q > a > div.O9Z-o > div
        click_name = store.find_element_by_css_selector("div._3hn9q > a > div.O9Z-o > div > span.OXiLu") #세부정보 띄울 click 지점 저장
        #print(name, rating)
        #print(img_src)
        final_result.append((name,float(rating),img_src,click_name))
    final_result.sort(key = lambda x : -x[1])
    current = final_result[0]
    click_name = current[3]
    
    click_name.click() # address는 세부정보에 적혀있음
    driver.switch_to.default_content()
    time.sleep(0.5)        
    frame_in = driver.find_element_by_css_selector('iframe#entryIframe') #장소 세부
    driver.switch_to.frame(frame_in) 
    # 가게 이름을 클릭하면 나오는 세부 정보 iframe으로 이동
    time.sleep(0.5)
    
    try:
        address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[3]/div/ul/li[2]/div/a/span[1]").text
    except:
        try : 
            address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[2]/div/ul/li[2]/div/a/span[1]").text
        except : 
            try :
                address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[1]/div/ul/li[2]/div/a/span[1]").text
            except :
                address = ''
    return (current[0],current[2],address)

def recommendCafe(locname) :
    print(locname)
    display = Display(visible=0, size=(1024, 768))
    display.start()
    path = r"/home/ubuntu/chromedriver"
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(path, options=chrome_options)
    print(driver.capabilities['browserVersion'])
    driver.get("https://map.naver.com/v5/")
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "input_search"))
        ) #입력창이 뜰 때까지 대기
    except TimeoutException :
        print("타임아웃")
        return "ERROR"
    finally:
        pass
    search_box = driver.find_element_by_class_name("input_search")
    search_box.send_keys(locname)
    time.sleep(2)
    search_box.send_keys(Keys.ENTER)
    search_box.clear()
    time.sleep(2)
    #search_box = driver.find_element_by_class_name("input_search")
    search_box.send_keys("카페/디저트/음료")
    search_box.send_keys(Keys.ENTER)

    time.sleep(2) #화면 표시 기다리기
    frame = driver.find_element_by_css_selector("iframe#searchIframe")

    driver.switch_to.frame(frame)

    time.sleep(2)
    try :
        scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[2]/div[1]")
    except :
        try :
            scroll_div = driver.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]")
        except :
            return "Error1"
    print(scroll_div)
    driver.execute_script("arguments[0].scrollBy(0,2000)", scroll_div)
    time.sleep(2)
    #검색 결과로 나타나는 scroll-bar 포함한 div 잡고
    category = ""
    final_result=[]
    flag = 0
    try :
        places_box_className = driver.find_element_by_xpath("/html/body/div[3]/div/div[2]/div[1]/ul/li[1]").get_attribute('class').replace(" ", ".")  # 장소 정보가 들어있는 아이템(li) class명 수집
    except :
        try :
            places_box_className = driver.find_element_by_xpath("/html/body/div[3]/div/div[1]/div[1]/ul/li[1]").get_attribute('class').replace(" ", ".")
        except :
            return "No names"
    stores = driver.find_elements_by_css_selector("li."+places_box_className)
    #stores = driver.find_elements_by_css_selector("#_pcmap_list_scroll_container > ul > li")
    print(len(stores))
    for store in stores: #한 페이지 내에서의 반복문. 순차적으로 가게 정보에 접근
        #/html/body/div[3]/div/div[2]/div[1]/ul/li[1]/div[1]/a/div[1]/div/span
        #_pcmap_list_scroll_container > ul > li:nth-child(20) > div._3hn9q > a > div.O9Z-o > div > span.OXiLu
        name = store.find_element_by_css_selector("div>span").text  #가게 이름
        print(name)
        try:
            click_name = store.find_element_by_css_selector("div>span").click() ##상세 정보창으로 이동, 오류시 반복문 종료
        except:
            return "ERROR2"
        driver.switch_to.default_content()
        time.sleep(2)
        #_pcmap_list_scroll_container > ul > li:nth-child(7) > div._3ZU00._1rBq3 > a:nth-child(1) > div > div > span._3Apve
        #print(name, rating)
        #print(img_src)
        driver.switch_to.default_content()
        time.sleep(2)
        frame_in = driver.find_element_by_css_selector('iframe#entryIframe') #장소 세부
        driver.switch_to.frame(frame_in)
        # 가게 이름을 클릭하면 나오는 세부 정보 iframe으로 이동
        time.sleep(2)

        try:
            address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[3]/div/ul/li[2]/div/a/span[1]").text
        except:
            try :
                address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[2]/div/ul/li[2]/div/a/span[1]").text
            except :
                try :
                    address = driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[6]/div/div[1]/div/ul/li[2]/div/a/span[1]").text
                except :
                    continue
        try :
            img_src = re.search('url[(]"([\S]+)"', driver.find_element_by_xpath("/html/body/div[3]/div/div/div/div[1]/div/div[1]/div/a/div").get_attribute('style')).groups()[0]
        except :
            continue

        return (name, img_src, address)

def get_loc(la, lo):
    x_val = lo
    y_val = la

    base_url = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x='+str(x_val)+'&y='+str(y_val)+'&input_coord=WGS84'

    api_key = 'dc29e5d5ca56e88abd052bf86520ee62'
    headers = {'Authorization':'KakaoAK ' + api_key}

    api_req = requests.get(base_url,headers = headers)
    return api_req
