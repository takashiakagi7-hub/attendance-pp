// ==================== Firebase初期化管理 ====================
let db = null;
let isFirebaseConfigured = false;

function initializeFirebase() {
    try {
        console.log('🔧 Firebase初期化開始...');
        console.log('📋 使用中のコンフィグ:', {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain,
            databaseURL: firebaseConfig.databaseURL
        });
        
        // Firebase SDK が読み込まれているか確認
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDKが読み込まれていません');
        }
        
        console.log('✓ Firebase SDK 確認');
        
        // 既に初期化されていないか確認
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            console.log('✓ Firebase アプリ初期化完了');
        } else {
            console.log('⚠️ Firebase既に初期化済み');
        }
        
        db = firebase.database();
        console.log('✓ Realtime Database 参照取得完了');
        isFirebaseConfigured = true;
        
        // 接続テスト
        console.log('🔗 Firebase 接続テスト中...');
        db.ref('.info/connected').once('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('✅✅✅ Firebase 接続成功！🎉');
                updateConfigMessage('✅ Firebase接続成功！', true);
                updateConnectionStatus('online');
            } else {
                console.error('❌ Firebase 接続失敗');
                updateConfigMessage('❌ Firebase接続失敗：セキュリティルール設定を確認してください', false);
                updateConnectionStatus('offline');
            }
        }).catch((error) => {
            console.error('❌ 接続テストエラー:', error.code, error.message);
            updateConfigMessage('❌ エラー: ' + error.message, false);
            updateConnectionStatus('offline');
        });
        
        return true;
    } catch (error) {
        console.error('✗✗✗ Firebase初期化エラー:', error);
        console.error('📝 詳細:', error.code, error.message);
        updateConfigMessage('❌ Firebase接続エラー: ' + error.message, false);
        return false;
    }
}

function updateConfigMessage(message, isSuccess) {
    const msgEl = document.getElementById('configMsg');
    if (!msgEl) return;
    msgEl.textContent = message;
    msgEl.classList.remove('hidden');
    if (isSuccess) {
        msgEl.classList.add('success');
        msgEl.classList.remove('config-alert');
    } else {
        msgEl.classList.remove('success');
        msgEl.classList.add('config-alert');
    }
}

// バージョン情報を表示
function displayVersionInfo() {
    const versionEl = document.getElementById('versionInfo');
    if (versionEl) {
        versionEl.textContent = `バージョン: ${SYSTEM_INFO.VERSION} (${SYSTEM_INFO.RELEASE_DATE})`;
    }
}
