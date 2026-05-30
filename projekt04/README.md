
Aplikacja webowa do zarządzania bazą skuterów. Node.js + Express + PostgreSQL.

## Wymagania

- [Node.js](https://nodejs.org/) >= 18
- PostgreSQL >= 14

## Instalacja

### 1. Zainstaluj PostgreSQL

**Mac (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

**Windows:** pobierz instalator z https://www.postgresql.org/download/windows/

### 2. Utwórz bazę danych

```bash
psql postgres -c "CREATE DATABASE scooterbase;"
psql scooterbase < database.sql
```

### 3. Zainstaluj zależności

```bash
npm install
```

### 4. Ustaw zmienne środowiskowe

**Mac/Linux:**
```bash
export PG_USER=twoja_nazwa_systemowa   # sprawdź: whoami
export PG_PASSWORD=twoje_haslo         # pomiń jeśli brak hasła
```

**Windows (PowerShell):**
```powershell
$env:PG_USER="postgres"
$env:PG_PASSWORD="twoje_haslo"
```

### 5. Uruchom

```bash
npm start
```

Otwórz: **http://localhost:8000**

## Konto administratora

Tworzone automatycznie przy pierwszym uruchomieniu.

| Login | Hasło |
|-------|-------|
| admin | admin123 |

