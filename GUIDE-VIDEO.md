# 🎬 GUIDE VIDÉO HERO

## ✅ PROBLÈME RÉSOLU

### Le son se jouait ?
**SOLUTION :** J'ai ajouté un script JavaScript qui FORCE le mute de 3 façons :
1. Attribut HTML `muted`
2. JavaScript `video.muted = true`
3. JavaScript `video.volume = 0`

### Adaptée à toutes les tailles ?
**SOLUTION :** Script automatique qui calcule le ratio et adapte la vidéo

---

## 📁 FORMATS SUPPORTÉS

Le site supporte maintenant **2 formats** :

```html
<video autoplay muted loop playsinline>
    <source src="videos/presentation.mp4" type="video/mp4">
    <source src="videos/presentation.webm" type="video/webm">
</video>
```

**Le navigateur choisit automatiquement le meilleur format !**

---

## 🎥 AJOUTER TA VIDÉO

### Étape 1 : Convertir en 2 formats

**Option A : Utiliser FFmpeg (recommandé)**
```bash
# Convertir en MP4 optimisé
ffmpeg -i ta-video.mov -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k presentation.mp4

# Convertir en WebM optimisé
ffmpeg -i ta-video.mov -c:v libvpx-vp9 -crf 30 -b:v 0 presentation.webm
```

**Option B : Utiliser un site en ligne**
- https://cloudconvert.com/
- Convertir en MP4 (H.264) + WebM (VP9)

### Étape 2 : Placer les vidéos
```bash
maison-louise-final/
└── videos/
    ├── presentation.mp4   ← Ajouter ici
    └── presentation.webm  ← Ajouter ici
```

### Étape 3 : Tester
```bash
python -m http.server 8000
# Ouvrir http://localhost:8000
# CTRL + F5 pour rafraîchir
```

---

## 🔇 VÉRIFIER QUE LE SON EST BIEN MUTÉ

### Test 1 : Vérifier l'attribut
```javascript
// Ouvrir DevTools Console
const video = document.getElementById('heroVideo');
console.log('Muted:', video.muted);  // Doit afficher: true
console.log('Volume:', video.volume); // Doit afficher: 0
```

### Test 2 : Sur mobile
1. Ouvrir le site sur mobile
2. Le son NE DOIT PAS se jouer automatiquement
3. Même après un clic

---

## 📐 RESPONSIVE VIDÉO

### Comment ça marche ?
Le script calcule automatiquement :

```javascript
const videoRatio = 16 / 9;  // Ratio vidéo
const windowRatio = window.innerWidth / window.innerHeight;

if (windowRatio > videoRatio) {
    // Écran large : élargir la vidéo
    video.style.width = '100vw';
} else {
    // Écran haut : agrandir en hauteur
    video.style.height = '100vh';
}
```

**Résultat :** La vidéo couvre TOUJOURS tout l'écran sans bandes noires ! 🎯

---

## 🎨 FLOU ADAPTATIF

Le flou diminue sur mobile pour améliorer la lisibilité :

```css
Desktop: blur(8px)
Tablet:  blur(5px)
Mobile:  blur(3px)
```

---

## ⚙️ OPTIONS ALTERNATIVES

### Option 1 : Vidéo sans son
✅ **C'est ce qui est fait actuellement**
- Pas de fichier audio dans la vidéo
- Plus léger
- Aucun risque de son

### Option 2 : Image fixe au lieu de vidéo
Si la vidéo pose problème :

```html
<div class="hero" style="background: linear-gradient(135deg, rgba(224,229,236,0.95), rgba(26,41,71,0.9)), url('images/hero-bg.jpg'); background-size: cover;">
```

### Option 3 : Désactiver la vidéo sur mobile
```javascript
if (window.innerWidth < 768) {
    heroVideo.style.display = 'none';
}
```

---

## 🐛 DÉPANNAGE

### Le son se joue quand même ?
```javascript
// Ajouter ceci dans app.js
heroVideo.addEventListener('volumechange', () => {
    if (heroVideo.volume > 0) {
        heroVideo.volume = 0;
        heroVideo.muted = true;
    }
});
```

### La vidéo ne couvre pas tout l'écran ?
```css
/* Forcer le cover */
.hero-video {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
}
```

### Performance lente ?
1. Réduire la taille de la vidéo (< 5MB)
2. Utiliser WebM (meilleure compression)
3. Réduire la qualité : `-crf 30` au lieu de `-crf 23`

---

## 📊 TAILLES RECOMMANDÉES

| Format | Résolution | Poids idéal |
|--------|------------|-------------|
| MP4    | 1920x1080  | 2-5 MB      |
| WebM   | 1920x1080  | 1-3 MB      |

**Plus petit = plus rapide !**

---

## ✅ CHECKLIST FINALE

- [ ] Vidéo en MP4 + WebM
- [ ] Poids < 5MB
- [ ] Son muté (vérifier dans DevTools)
- [ ] Couvre tout l'écran sur desktop/tablet/mobile
- [ ] Pas de bandes noires
- [ ] Pas de déformation
- [ ] Autoplay fonctionne
- [ ] Loop fonctionne

---

**🎉 TA VIDÉO EST MAINTENANT PARFAITE !**

Le son est FORCÉ à 0, la vidéo s'adapte à TOUS les écrans, et le flou masque le watermark ! 💎
