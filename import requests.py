import requests
from bs4 import BeautifulSoup
import pandas as pd

# URL do site
url = "https://tfdtools.com/modules"

# Faz a requisição para obter o HTML da página
response = requests.get(url)
response.raise_for_status()  # Garante que a requisição foi bem-sucedida

# Parseia o HTML com BeautifulSoup
soup = BeautifulSoup(response.text, 'html.parser')

# Lista para armazenar os dados
data = []

# Encontra todos os módulos
modules = soup.find_all('a', class_='moduleCard')

for module in modules:
    # Link do módulo
    module_link = f"https://tfdtools.com{module.get('href')}"
    
    # Nome do módulo
    module_name = module.find('div', class_='moduleName').get_text(strip=True)
    
    # Tipo do módulo
    module_type = module.find('div', class_='CardModuleType').get_text(strip=True)
    
    # Imagem do módulo
    module_img = module.find('div', class_='moduleImg').find('img').get('srcset')
    module_img_link = module_img.split(',')[-1].strip().split(' ')[0] if module_img else ''
    module_img_link = f"https://tfdtools.com{module_img_link}" if not module_img_link.startswith('http') else module_img_link
    
    # Identificação da raridade (Standard, Rare, Ultimate, Transcendent)
    module_img_div = module.find('div', class_='moduleImg')
    module_rarity = 'Unknown'  # Valor padrão caso a raridade não seja identificada
    if module_img_div:
        # Verifica as classes possíveis para raridade
        if 'Standard' in module_img_div.get('class', []):
            module_rarity = 'Standard'
        elif 'Rare' in module_img_div.get('class', []):
            module_rarity = 'Rare'
        elif 'Ultimate' in module_img_div.get('class', []):
            module_rarity = 'Ultimate'
        elif 'Transcendent' in module_img_div.get('class', []):
            module_rarity = 'Transcendent'
    
    # Ícone da classe do módulo
    class_icon = module.find('div', class_='cardModuleClass').find('img').get('srcset')
    class_icon_link = class_icon.split(',')[-1].strip().split(' ')[0] if class_icon else ''
    class_icon_link = f"https://tfdtools.com{class_icon_link}" if not class_icon_link.startswith('http') else class_icon_link
    
    # Tipo de soquete
    socket = module.find('div', class_='socketBanner').find('img').get('srcset')
    socket_icon_link = socket.split(',')[-1].strip().split(' ')[0] if socket else ''
    socket_icon_link = f"https://tfdtools.com{socket_icon_link}" if not socket_icon_link.startswith('http') else socket_icon_link
    
    # Nome do tipo de soquete
    socket_type = socket_icon_link.split('/')[-1].split('.')[0] if socket_icon_link else ''
    
    # Quantidade de soquetes
    socket_count = module.find('div', class_='socketBanner').find('span').get_text(strip=True)
    
    # Adiciona os dados na lista
    data.append({
        'Module Name': module_name,
        'Module Type': module_type,
        'Module Rarity': module_rarity,
        'Module Link': module_link,
        'Module Image': module_img_link,
        'Class Icon': class_icon_link,
        'Socket Icon': socket_icon_link,
        'Socket Type': socket_type,
        'Socket Count': socket_count
    })

# Salva os dados em uma planilha Excel
df = pd.DataFrame(data)
df.to_excel('modules_data_updated.xlsx', index=False)

print("Os dados dos módulos foram salvos no arquivo 'modules_data_updated.xlsx'.")
