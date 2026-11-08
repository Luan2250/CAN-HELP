"""
Troca o menu de TODAS as páginas por um único menu (js/navbar.js).

Como usar (na pasta frontend, onde ficam os .html):
    python aplicar_navbar.py

O que ele faz em cada página .html que tem <header class="topbar">:
  1. troca o <header> inteiro por um espaço vazio que o navbar.js preenche;
  2. garante que js/app.js, js/auth.js e js/navbar.js estejam carregados.
Pode rodar mais de uma vez sem estragar nada. Cria um backup .bak ao lado de cada página alterada.
"""
import glob
import re
import shutil

PLACEHOLDER = '<header class="topbar" id="site-header"></header>\n  <script src="js/navbar.js"></script>'
PAGINAS_SEM_MENU = {'login.html', 'cadastro.html', 'index.html'}

alteradas = []
for arquivo in sorted(glob.glob('*.html')):
    if arquivo in PAGINAS_SEM_MENU:
        continue

    with open(arquivo, encoding='utf-8', newline='') as f:
        texto = f.read()

    if 'id="site-header"' in texto:
        continue  # já aplicado

    novo, trocas = re.subn(r'<header class="topbar"[^>]*>.*?</header>', PLACEHOLDER, texto, count=1, flags=re.S)
    if trocas == 0:
        print(f'  (pulado) {arquivo}: não tem <header class="topbar">')
        continue

    # Garante os scripts. app.js e auth.js entram logo depois de um app.js já existente (ou antes de </body>).
    quebra = '\r\n' if '\r\n' in texto else '\n'
    if 'js/app.js' not in novo:
        novo = novo.replace('</body>', f'  <script src="js/app.js"></script>{quebra}</body>', 1)
    if 'js/auth.js' not in novo:
        novo = re.sub(r'(<script src="js/app.js"></script>)', r'\1' + quebra + '  <script src="js/auth.js"></script>', novo, count=1)

    shutil.copyfile(arquivo, arquivo + '.bak')
    with open(arquivo, 'w', encoding='utf-8', newline='') as f:
        f.write(novo)
    alteradas.append(arquivo)

print(f'{len(alteradas)} página(s) atualizada(s):')
for a in alteradas:
    print('  -', a)