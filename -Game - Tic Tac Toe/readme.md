** Opis:

Igra treba se sastoji od tabele 3x3 i igra se u dva igraca. Svaki igrac naizmenicno postavlja svoj znak. Prvi igrac: "X",a drugi igrac "O". Cilj je spojiti 3 svoja znaka uspravno, vodoravno ili dijagonalno. Igra se tada zavrsava. Ako se tabela popuni, a niko od igraca ne uspe da kompletira spajanje rezultat je neresen.


** Funkcionalnost:

- Igra pocinje kada se izabere "Nova Igra" dugme. Prvi igrac je uvek "X", dok je drugi igrac uvek "O".

- 

- Izborom dugmeta "Save" igra koja nije zavrsena se cuva u bazi
- Izborom dugmeta "Load" se otvara tabela sa sacuvanim igrama. Sadrze sve opcije kao iz istorije s tim sto se pobednik menja sa indikatorom ko je na potezu. Izborom igre, partija se ucitava i igra pocinje.

- Igra automatski pamti koliko je ko puta pobedio u toku jedne sesije i skladisti u bazu. Klikom na dugme "Reset Score" se rezultat menja
- Istoriji rezultata se pristupa na dugme "Istorija".
- U istorji se nalazi tabela sa odigranim partijama. 
- Svaka partija sadrzi sledece informacije u tabeli:
    - datum partije (datum i vreme)
    - ko je pobednik
    - koliko poteza
    - vreme trajanja partije
    - imena prvog i drugog igraca i ko je X, a ko O
- Kada se klikne na partiju iz Istorije, posle upita, otvara se pop up prozor u kome se mogu videti potezi izabrane partije:
    - prozor sadrzi kontrole za:
        - pauzu
        - play
        - prehodni potez
        - sledeci potez
    - potezi teku automatski po otvaranju prozora dok se ne pritisne pauza


** Interfejs: 

- naslov igre
- tabela za igru
- indikator ko je na potezu
- brojac pobeda za svakog igraca
- brojac poteza
- tajmer partije
- dugmad: 
    - Nova Igra (zapocinje novu igru)
    - Predaj (trenutni igrac predaje pobedu drugom igracu)
    - Save (cuva trenutnu nezavrsenu igru)
    - Load (ucitava sacuvanu igru po izboru)
    - Reset (resetuje pobede)
    - Player1 Name
    - PLayer2 Name


** Dodatno:

- dodati zvucne efekte za:
    - start igre
    - selekciju polja
    - pobedu
    - predaju
    - nereseno
    - prateca muzika
    - kontrolu za:
        - on/off za muziku
        - on/off za zvucne efekte



















