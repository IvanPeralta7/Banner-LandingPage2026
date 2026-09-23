@echo off
:: ============================================================
:: ARCHIVO: servidor.bat
:: DESCRIPCIÓN: Levanta un servidor HTTP local para probar
:: la landing page en el navegador sin necesidad de subir
:: los archivos a un hosting.
:: Usa Python (incluido en Windows 10/11 o instalable gratis).
:: ============================================================

:: Evita que los comandos internos se muestren en pantalla
setlocal enabledelayedexpansion

:: ────────────────────────────────────────────────────────────
:: CONFIGURACIÓN
:: Podés cambiar el puerto si el 8000 ya está en uso
:: ────────────────────────────────────────────────────────────
set PUERTO=8000


:: ────────────────────────────────────────────────────────────
:: ENCABEZADO VISUAL
:: ────────────────────────────────────────────────────────────
echo.
echo  =========================================
echo   SERVIDOR LOCAL - LANDING PAGE
echo  =========================================
echo.


:: ────────────────────────────────────────────────────────────
:: VERIFICACIÓN DE PYTHON
:: Comprueba si Python está instalado antes de continuar.
:: Si no lo encuentra, muestra instrucciones de descarga.
:: ────────────────────────────────────────────────────────────
python --version >nul 2>&1

if %errorlevel% neq 0 (
    echo  [ERROR] Python no está instalado o no está en el PATH.
    echo.
    echo  Para instalarlo:
    echo  1. Abrí https://www.python.org/downloads/
    echo  2. Descargá la versión más reciente para Windows
    echo  3. Durante la instalación, marcá la opción:
    echo     "Add Python to PATH"
    echo  4. Volvé a ejecutar este archivo
    echo.
    pause
    exit /b 1
)


:: ────────────────────────────────────────────────────────────
:: POSICIONAMIENTO EN LA CARPETA DEL PROYECTO
:: El script se mueve automáticamente a su propia ubicación,
:: así funciona sin importar desde dónde se ejecute.
:: ────────────────────────────────────────────────────────────
cd /d "%~dp0"


:: ────────────────────────────────────────────────────────────
:: VERIFICACIÓN DE ARCHIVOS NECESARIOS
:: Confirma que index.html existe antes de iniciar el servidor.
:: ────────────────────────────────────────────────────────────
if not exist "index.html" (
    echo  [ERROR] No se encontró index.html en esta carpeta.
    echo.
    echo  Asegurate de que servidor.bat esté en la misma
    echo  carpeta que index.html, css\ y js\
    echo.
    pause
    exit /b 1
)


:: ────────────────────────────────────────────────────────────
:: INICIO DEL SERVIDOR
:: Inicia el módulo HTTP de Python en el puerto configurado
:: y abre el navegador automáticamente.
:: ────────────────────────────────────────────────────────────
echo  Iniciando servidor en el puerto %PUERTO%...
echo.
echo  URL local:  http://localhost:%PUERTO%
echo.
echo  Para detener el servidor: cerrá esta ventana
echo         o presioná Ctrl + C
echo.
echo  =========================================
echo.

:: Abre el navegador predeterminado apuntando al servidor local
:: El timeout da 1 segundo para que el servidor arranque primero
timeout /t 1 /nobreak >nul
start http://localhost:%PUERTO%

:: Lanza el servidor HTTP de Python (compatible con Python 3)
python -m http.server %PUERTO%

:: Si el servidor se detiene, muestra mensaje y espera
echo.
echo  Servidor detenido.
pause
