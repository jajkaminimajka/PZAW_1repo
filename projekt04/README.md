# ScooterBase

---

##  MacOS

**1. Zainstaluj Node.js i PostgreSQL przez Homebrew**
```bash
brew install node postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
brew services start postgresql@16
```

**2. Sklonuj projekt**
```bash
git clone https://github.com/jajkaminimajka/PZAW_1repo.git
cd PZAW_1repo/projekt04
```

**3. Stwórz bazę danych**
```bash
psql postgres -c "CREATE DATABASE scooterbase;"
psql scooterbase < database.sql
```

**4. W pliku `app.js` zmień dane bazy danych**
```js
user: "twoja_nazwa",   // sprawdź komendą: whoami
password: "",          // zostaw puste jeśli brak hasła
```

**5. Uruchom**
```bash
npm install
npm start
```

---

## Windows

**1. Zainstaluj Node.js i Git**

Pobierz i zainstaluj instalatory ze stron:
- https://nodejs.org *(wersja LTS)*
- https://git-scm.com

**2. Sklonuj projekt** *(otwórz cmd lub PowerShell)*
```cmd
git clone https://github.com/jajkaminimajka/PZAW_1repo.git
cd PZAW_1repo\projekt04
```

**3. Zainstaluj PostgreSQL**

Pobierz z https://postgresql.org/download/windows i zainstaluj. Podczas instalacji zapamiętaj hasło do użytkownika `postgres`.

**4. Stwórz bazę danych** *(otwórz SQL Shell z menu Start, naciśnij Enter kilka razy, wpisz hasło)*
```sql
CREATE DATABASE scooterbase;
\q
```
Następnie załaduj tabele:
```cmd
psql -U postgres -d scooterbase -f database.sql
```

**5. W pliku `app.js` zmień dane bazy danych**
```js
user: "postgres",
password: "twoje_haslo",  // hasło z instalacji PostgreSQL
```

**6. Uruchom**
```cmd
npm install
npm start
```

---


Otwórz: http://localhost:8000

> Login: `admin` &nbsp;|&nbsp; Hasło: `admin123`
