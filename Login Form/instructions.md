- prvo ispravite u html-u sve greške koje vidite
- inicijalno forma za registraciju treba da bude sakrivena kao i forma za zaboravljenu šifru i div #ulogovan
- ako kliknemo na link registruj se forma za registraciju treba da bude prikazana a forma za logovanje sakrivena
- kad popunimo formu za registraciju u local storage pod ključem "korisnici" treba da se upišu svi podaci koje smo 
popunili u formi
- ako popunimo formu za logovanje i pošaljemo treba da se proveri u localStorage u objektu "korisnici" da li postoji ta
 kombinacija korisničkog imena i šifre, ako ne postoji treba da mu kažemo da su podaci netačni, ako korisničko ime 
 postoji reći ćemo mu da je šifra netačna
- ako su podaci pri logovanju tačni treba da se prikaže div #ulogovan, u span tagu treba da se upiše nik ulogovanog 
korisnika ( za ovo možete koristiti ključ u localStorage "ulogovaniKorisnik"
- Ako kliknemo na link "Izloguj se" korisnik treba da ponovo bude izlogovan
- Ako pošaljemo formu za zaboravljenu šifru treba da nam se prikaže naš "security question" i polje za unos odgovora 
na to pitanje, nakon toga opet treba da kliknemo na dugme za potvrdu i ako odgovorimo tačno treba da nam se prikaže 
naša šifra.
- Nakon što smo sve uradili treba da napravimo da stranica izgleda različito za neulogovanog i ulogovanog korisnika
- Napravite i stranicu za promenu šifre
- Napravite stranice uredi profil i moj profil, tu dodajte još 5 polja koja ne postoje u registraciji
        - rođendan  -
        - pol -
        - bio -
        - mesto rođenja -
        - interesovanja - 10 ponuđenih plus mogućnost da upiše nešto što ne postoji na spisku
- dodajte validaciju na sve forme gde mislite da je potrebno
- prepakujte kod tako da lako sa copy/paste može biti upotrebljen na nekom drugom projektu