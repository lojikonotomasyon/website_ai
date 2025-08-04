// Sorter Animation - Konveyor Sistemi
// Soldan sağa hareket eden konveyor bandı ve ürünler

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sorter konveyor sistemi başlatılıyor...');
    
    // Hero animasyon elementlerini al
    const heroBeltSurface = document.querySelector('.sorter-hero-animation .belt-surface');
    const heroRollers = document.querySelectorAll('.sorter-hero-animation .roller');
    const conveyorBelt = document.querySelector('.sorter-hero-animation .conveyor-belt');
    const conveyorSystem = document.querySelector('.sorter-hero-animation .conveyor-system');
    
    // Animasyonları başlat
    if (heroBeltSurface) {
        heroBeltSurface.style.animationPlayState = 'running';
    }
    
    heroRollers.forEach((roller, index) => {
        roller.style.animationPlayState = 'running';
    });
    
    // Ürün türleri ve sepet eşleştirmeleri
    const productTypes = ['box', 'envelope', 'tote', 'package'];
    const basketMapping = {
        'box': 'red-basket',
        'envelope': 'blue-basket', 
        'tote': 'green-basket',
        'package': 'pink-basket'
    };
    
    // Sepet pozisyonları (divertor pozisyonlarıyla eşleştirildi)
    const basketPositions = {
        'box': 0.09,      // %9 pozisyonu - Kırmızı divertor
        'envelope': 0.35, // %35 pozisyonu - Mavi divertor
        'tote': 0.61,     // %61 pozisyonu - Yeşil divertor
        'package': 0.86   // %86 pozisyonu - Pembe divertor
    };
    
    // Sepet sayaçları
    const basketCounts = {
        'box': 0,
        'envelope': 0,
        'tote': 0,
        'package': 0
    };
    
    let productCounter = 0;
    let isPageVisible = true;
    let animationId;
    
    // Animasyon durumu
    let isPaused = false;
    let animationSpeed = 1;
    
    // Kontrol butonlarını ayarla
    function setupControls() {
        const pauseBtn = document.getElementById('pause-btn');
        const speedSlider = document.getElementById('speed-slider');
        const speedDisplay = document.getElementById('speed-display');
        
        // Pause/Resume butonu
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                isPaused = !isPaused;
                
                // Buton ikonunu güncelle
                const icon = pauseBtn.querySelector('i');
                if (icon) {
                    icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
                }
                
                // Animasyonları duraklat/devam ettir
                updateAnimationState();
            });
        }
        
        // Hız kontrolü
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener('input', (e) => {
                animationSpeed = parseFloat(e.target.value);
                speedDisplay.textContent = `${animationSpeed}x`;
                
                // Animasyon hızını güncelle
                updateAnimationSpeed();
                startProductCreation(); // Hız değiştiğinde ürün oluşturma aralığını güncelle
            });
        }
    }
    
    // Animasyon durumunu güncelle
    function updateAnimationState() {
        if (heroBeltSurface) {
            heroBeltSurface.style.animationPlayState = (isPaused || !isPageVisible) ? 'paused' : 'running';
        }
        
        heroRollers.forEach(roller => {
            roller.style.animationPlayState = (isPaused || !isPageVisible) ? 'paused' : 'running';
        });
        
        // Hareket eden ürünleri duraklat/devam ettir
        const movingProducts = document.querySelectorAll('.sorter-product.moving');
        movingProducts.forEach(product => {
            product.style.animationPlayState = (isPaused || !isPageVisible) ? 'paused' : 'running';
        });
    }
    
    // Animasyon hızını güncelle
    function updateAnimationSpeed() {
        if (heroBeltSurface) {
            heroBeltSurface.style.animationDuration = `${3 / animationSpeed}s`;
        }
        
        heroRollers.forEach(roller => {
            roller.style.animationDuration = `${1 / animationSpeed}s`;
        });
        
        // Hareket eden ürünlerin hızını güncelle
        const movingProducts = document.querySelectorAll('.sorter-product.moving');
        movingProducts.forEach(product => {
            product.style.animationDuration = `${3 / animationSpeed}s`;
        });
    }
    
    // Dashboard değerlerini güncelle
    function updateDashboard() {
        const speedElement = document.getElementById('speed-value');
        const capacityElement = document.getElementById('capacity-value');
        const efficiencyElement = document.getElementById('efficiency-value');
        const totalElement = document.getElementById('total-value');
        
        if (speedElement && capacityElement && efficiencyElement && totalElement) {
            // Toplam ürün sayısını hesapla
            const totalProducts = Object.values(basketCounts).reduce((sum, count) => sum + count, 0);
            
            // Hız: Dakikada işlenen ürün sayısı (animasyon hızına göre)
            const speed = Math.round(60 / 3); // 3 saniyede 1 ürün = 20 ürün/dakika
            
            // Kapasite: Saatte işlenebilecek maksimum ürün
            const capacity = speed * 60; // 1200 ürün/saat
            
            // Verimlilik: Başarılı sıralama oranı (%)
            const efficiency = totalProducts > 0 ? 98.5 : 0; // Sabit %98.5 verimlilik
            
            // Değerleri güncelle
            speedElement.textContent = speed;
            capacityElement.textContent = capacity;
            efficiencyElement.textContent = efficiency.toFixed(1);
            totalElement.textContent = totalProducts;
        }
    }
    
    // Sepet sayacını güncelle
    function updateBasketCount(productType) {
        basketCounts[productType]++;
        
        const basket = document.querySelector(`.${basketMapping[productType]}-basket .basket-count`);
        if (basket) {
            basket.textContent = basketCounts[productType];
        }
        
        // Dashboard'u güncelle
        updateDashboard();
    }
    
    // Ürün düşüş animasyonu
    function dropProduct(product, productType) {
        // Ürünün mevcut pozisyonunu al
        const currentLeft = parseFloat(product.style.left) || -50;
        const currentTop = parseInt(product.style.top) || 25;
        const startTime = Date.now();
        const dropDuration = 500; // 0.5 saniye düşüş (2 kat hızlı)

        // Düşüş class'ını ekle
        product.classList.add('dropping');

        // Divertor pozisyonunu hesapla (merkez noktası)
        const conveyorWidth = conveyorSystem.offsetWidth;
        const targetPosition = basketPositions[productType];
        const divertorCenterX = targetPosition * conveyorWidth; // Divertor'ın merkez pozisyonu
        
        // Ürünün düşüş pozisyonunu ayarla (divertor merkezine)
        product.style.left = `${divertorCenterX}px`;
        product.style.top = `${currentTop}px`;

        // İlgili divertor'ı aktif hale getir
        const divertorSelector = basketMapping[productType].replace('-basket', '-divertor');
        const divertor = document.querySelector(`.${divertorSelector}`);
        
        if (divertor) {
            divertor.classList.add('active');
            
            // 750ms sonra divertor'ı deaktif hale getir
            setTimeout(() => {
                divertor.classList.remove('active');
            }, 750);
        }

        function animateDrop() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / dropDuration, 1);

            // Easing fonksiyonu (daha doğal düşüş)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            // Dinamik düşüş mesafesi hesapla
            const conveyorHeight = conveyorSystem.offsetHeight;
            const basketTop = 250; // Sepetlerin üst kısmı (conveyor yüksekliği - bottom - basket yüksekliği)
            const dropDistance = basketTop - currentTop; // Sepetlere kadar olan mesafe
            
            const newTop = currentTop + (easeProgress * dropDistance);
            product.style.top = `${newTop}px`;

            if (progress < 1) {
                animationId = requestAnimationFrame(animateDrop);
            } else {
                // Düşüş tamamlandı, ürünü kaldır ve sayacı güncelle
                updateBasketCount(productType);
                
                if (product.parentNode) {
                    product.parentNode.removeChild(product);
                }
            }
        }

        animateDrop();
    }
    
    // Ürün pozisyonunu takip et ve düşüş kontrolü yap
    function checkProductPosition(product, productType) {
        // CSS animasyonu ile güncellenen left pozisyonunu al
        const computedStyle = window.getComputedStyle(product);
        const currentLeft = parseFloat(computedStyle.left) || 0;
        const conveyorWidth = conveyorSystem.offsetWidth;
        
        // Ürün boyutunu al
        const productWidth = product.offsetWidth;
        const productCenter = currentLeft + (productWidth / 2); // Ürünün merkezi
        
        // Konveyor sistemi içindeki pozisyonu hesapla (0-1 arası) - ürün merkezi baz alınarak
        const relativeX = productCenter / conveyorWidth;
        
        // Hedef divertor pozisyonunu kontrol et
        const targetPosition = basketPositions[productType];
        const tolerance = 0.05; // %5 tolerans
        
        if (Math.abs(relativeX - targetPosition) < tolerance) {
            // Yatay hareketi durdur ve mevcut pozisyonu koru
            product.classList.remove('moving');
            product.style.animation = 'none';
            
            // Mevcut pozisyonu hemen ayarla
            product.style.left = `${currentLeft}px`;
            
            // Düşüş animasyonunu başlat
            dropProduct(product, productType);
            return true; // Düşüş başladı
        }
        
        return false; // Henüz düşüş pozisyonunda değil
    }
    
    // Ürün oluşturma fonksiyonu
    function createProduct() {
        if (!conveyorSystem || !isPageVisible || isPaused) {
            return;
        }
        
        const product = document.createElement('div');
        const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
        
        product.className = `sorter-product ${productType}`;
        product.id = `product-${productCounter++}`;
        product.dataset.type = productType;
        
        // Ürünü konveyor sisteminin sol kenarından başlat
        product.style.position = 'absolute';
        product.style.left = '0px'; // Conveyor-system'in sol kenarından başla
        
        // Ürünün dikey pozisyonunu belt-surface'ın alt kenarına yakın ayarla
        product.style.top = '45px'; // Belt-surface'ın alt kenarına yakın (20px + 30px - 5px = 45px)
        
        product.style.zIndex = '999';
        
        // Ürünü konveyor sistemine ekle
        conveyorSystem.appendChild(product);
        
        // Ürünü hareket ettir
        setTimeout(() => {
            product.classList.add('moving');
            // Yeni ürünün hızını ayarla
            product.style.animationDuration = `${3 / animationSpeed}s`;
        }, 100);
        
        // Ürün pozisyonunu sürekli kontrol et
        const positionCheckInterval = setInterval(() => {
            if (!product.parentNode) {
                clearInterval(positionCheckInterval);
                return;
            }
            
            // Ürün düşüş pozisyonuna geldi mi kontrol et
            if (checkProductPosition(product, productType)) {
                clearInterval(positionCheckInterval);
            }
        }, 100); // Her 100ms'de bir kontrol et
        
        // Güvenlik için maksimum süre (eğer düşüş olmazsa)
        setTimeout(() => {
            if (product.parentNode) {
                clearInterval(positionCheckInterval);
                updateBasketCount(productType);
                product.parentNode.removeChild(product);
            }
        }, 6000); // 6 saniye sonra zorla kaldır
    }
    
    // Dinamik ürün oluşturma interval'i
    let productInterval;
    
    function startProductCreation() {
        // Önceki interval'i temizle
        if (productInterval) {
            clearInterval(productInterval);
        }
        
        // Hıza göre interval ayarla (1.5 saniye baz alınarak)
        const baseInterval = 1500; // 1.5 saniye
        const intervalTime = Math.max(500, baseInterval / animationSpeed); // Minimum 500ms
        productInterval = setInterval(createProduct, intervalTime);
    }
    
    // Her saniye yeni ürün oluştur
    startProductCreation();
    
    // Sayfa görünürlük kontrolü
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
        updateAnimationState();
        
        // Ürün oluşturmayı kontrol et
        if (isPageVisible && !isPaused) {
            startProductCreation();
        } else {
            if (productInterval) {
                clearInterval(productInterval);
            }
        }
    });
    
    // Sayfa kapatıldığında interval'i temizle
    window.addEventListener('beforeunload', () => {
        clearInterval(productInterval);
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // İlk dashboard güncellemesi
    updateDashboard();

    // Kontrol butonlarını ayarla
    setupControls();
}); 