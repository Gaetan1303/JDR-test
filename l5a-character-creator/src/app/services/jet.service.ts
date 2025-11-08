import { Injectable } from '@angular/core';

export interface JetResult {
  des: number[];
  gardes: number[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class JetService {
  /**
   * Jet de compétence classique (ex : Kenjutsu, Artisanat, etc.)
   * @param anneau Valeur de l'anneau (Air, Terre, Eau, Feu, Vide)
   * @param competence Rang de la compétence
   */
  jetCompetence(anneau: number, competence: number): JetResult {
    const nbDes = anneau + competence;
    const des = Array.from({ length: nbDes }, () => this.lancerDe10());
    const gardes = [...des].sort((a, b) => b - a).slice(0, anneau);
    const total = gardes.reduce((sum, val) => sum + val, 0);
    return { des, gardes, total };
  }

  /**
   * Jet d'attaque (identique à un jet de compétence, mais peut être adapté)
   */
  jetAttaque(anneau: number, competence: number): JetResult {
    return this.jetCompetence(anneau, competence);
  }

  /**
   * Jet de magie (ex : Maho, Shugenja, Kiho, etc.)
   * Peut être adapté selon les règles spécifiques
   */
  jetMagie(anneau: number, magie: number): JetResult {
    return this.jetCompetence(anneau, magie);
  }

  /**
   * Lance un dé à 10 faces (1d10)
   */
  private lancerDe10(): number {
    return Math.ceil(Math.random() * 10);
  }
}
