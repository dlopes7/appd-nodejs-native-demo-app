
import requests
import time
import random

urls = [    #'http://localhost:3000',
         'http://localhost:3000/error']

def main():
    while True:
        try:
            time.sleep(0.5)
            url = random.choice(urls)
            r = requests.get(url)
            print(url, r)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print('Erro', e)
            pass

    
    

if __name__ == '__main__':
    main()