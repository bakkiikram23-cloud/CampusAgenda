import { View, Text, StyleSheet, FlatList } from 'react-native';

type Categorie = 'Atelier' | 'Conférence' | 'Rencontre';
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';

type Evenement = {
  id: string;
  titre: string;
  categorie: Categorie;
  capacite: number;
  inscrits: number;
};

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

const totalEvenements = evenements.length;
const nbComplets = evenements.filter((e) => placesRestantes(e) === 0).length;
const nbAvecPlaces = evenements.filter((e) => placesRestantes(e) > 0).length;
const totalPlacesRestantes = evenements.reduce(
  (somme, e) => somme + placesRestantes(e),
  0
);
const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

const couleursStatut: Record<Statut, { fond: string; texte: string }> = {
  'Complet': { fond: '#FDE2E2', texte: '#B42318' },
  'Presque complet': { fond: '#FFEBD2', texte: '#B54708' },
  'Ouvert': { fond: '#DCF5E3', texte: '#157F3B' },
};

type BadgeEtatProps = {
  statut: Statut;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  const couleur = couleursStatut[statut];
  return (
    <View style={[styles.badge, { backgroundColor: couleur.fond }]}>
      <Text style={[styles.badgeTexte, { color: couleur.texte }]}>{statut}</Text>
    </View>
  );
}

type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const r = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.zoneTexte}>
        <Text style={styles.titre} numberOfLines={2}>
          {evenement.titre}
        </Text>
        <Text style={styles.categorie}>{evenement.categorie}</Text>
        <Text style={styles.places}>
          {r} {r > 1 ? 'places restantes' : 'place restante'}
        </Text>
      </View>
      <BadgeEtat statut={statutEvenement(evenement)} />
    </View>
  );
}

type BlocStatistiqueProps = {
  libelle: string;
  valeur: number;
};

function BlocStatistique({ libelle, valeur }: BlocStatistiqueProps) {
  return (
    <View style={styles.statistique}>
      <Text style={styles.valeur}>{valeur}</Text>
      <Text style={styles.libelle}>{libelle}</Text>
    </View>
  );
}

const mode: 'tous' | 'ateliers' = 'tous';

export default function App() {
  const evenementsAffiches = mode === 'tous' ? evenements : ateliersDisponibles;
  const titreMode = mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

  return (
    <View style={styles.container}>
      <View style={styles.entete}>
        <Text style={styles.titrePrincipal}>CampusAgenda</Text>
        <Text style={styles.sousTitre}>Événements du campus</Text>
      </View>

      <View style={styles.ligneStatistiques}>
        <BlocStatistique libelle="Événements" valeur={totalEvenements} />
        <BlocStatistique libelle="Complets" valeur={nbComplets} />
        <BlocStatistique libelle="Avec places" valeur={nbAvecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlacesRestantes} />
        <BlocStatistique libelle="Ateliers dispo" valeur={ateliersDisponibles.length} />
      </View>
      <Text style={styles.mode}>Mode d'affichage : {titreMode}</Text>
      <FlatList
        data={evenementsAffiches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={
          <Text style={styles.messageVide}>Aucun événement disponible.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#F1F5F9',
  },
  entete: {
    backgroundColor: '#0B3C9E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  titrePrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sousTitre: {
    fontSize: 14,
    color: '#DBEAFE',
    marginTop: 2,
  },
  ligneStatistiques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statistique: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
  },
  valeur: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B3C9E',
  },
  libelle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  mode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#0F172A',
  },
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
  },
  zoneTexte: {
    flex: 1,
    marginRight: 10,
  },
  titre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  categorie: {
    color: '#64748B',
    marginVertical: 4,
  },
  places: {
    color: '#334155',
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexShrink: 0,
  },
  badgeTexte: {
    fontWeight: '600',
    fontSize: 13,
  },
  messageVide: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
    marginTop: 20,
  },
});