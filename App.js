import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';

// --- 1. البيانات الافتراضية الثابتة للمنظومة ---
const initialProducts = [
  { id: 'PROD-1001', name: 'فلتر زيت هيدروليك', category: 'قطع غيار ميكانيكية', quantity: 3, unit: 'قطعة', minQty: 5, location: 'رف A3', price: 150 },
  { id: 'PROD-1002', name: 'كابل كهربائي 4 ملم', category: 'قطع غيار كهربائية', quantity: 120, unit: 'متر', minQty: 20, location: 'مستودع B', price: 5 },
  { id: 'PROD-1003', name: 'زيت محرك 5W30', category: 'زيوت وشحوم', quantity: 0, unit: 'لتر', minQty: 10, location: 'رف C1', price: 45 },
  { id: 'PROD-1004', name: 'مفتاح ربط 12 ملم', category: 'أدوات', quantity: 15, unit: 'قطعة', minQty: 2, location: 'صندوق 1', price: 25 },
];

const initialTransactions = [
  { id: 'TX-504', type: 'منصرف', productName: 'فلتر زيت هيدروليك', qty: 1, date: '2026-06-03', user: 'قسم: محمد الجعشني', ref: 'إذن صرف #60' },
  { id: 'TX-501', type: 'وارد', productName: 'كابل كهربائي 4 ملم', qty: 50, date: '2026-06-03', user: 'أحمد (أمين المخزن)', ref: 'سند استلام #102' },
  { id: 'TX-502', type: 'منصرف', productName: 'فلتر زيت هيدروليك', qty: 2, date: '2026-06-03', user: 'خالد (مهندس صيانة)', ref: 'تقرير صيانة #WR-99' },
  { id: 'TX-503', type: 'وارد', productName: 'مفتاح ربط 12 ملم', qty: 5, date: '2026-06-02', user: 'أحمد (أمين المخزن)', ref: 'سند استلام #101' },
];

const initialSuppliers = [
  { id: 'SUP-01', name: 'شركة الفهد للمعدات', phone: '0501234567', material: 'قطع غيار ميكانيكية', rating: 'ممتاز' },
  { id: 'SUP-02', name: 'محل الشهاب ليت', phone: '0559876543', material: 'كابلات ومواد كهربائية', rating: 'جيد جداً' },
  { id: 'SUP-03', name: 'الاشول للكهرباء', phone: '770970801', material: 'كهرباء', rating: 'نشط' },
];

// --- تعديل مصفوفة المستخدمين لتشمل حساب admin الأساسي ---
const initialUsers = [
  { id: 'U-01', name: 'admin', role: 'admin', password: '770970801', desc: 'حساب المدير الأساسي - صلاحيات كاملة للنظام' },
  { id: 'U-02', name: 'أحمد (أمين المستودع)', role: 'storekeeper', password: '456', desc: 'مسؤول عن تسجيل الوارد، وإصدار أذونات الصرف العامة' },
  { id: 'U-03', name: 'خالد (رئيس الصيانة)', role: 'engineer', password: '789', desc: 'مسؤول عن سحب وطلب قطع الغيار لأوامر تقارير الإصلاح' },
];

export default function App() {
  // --- 🔐 متغيرات حالة تسجيل الدخول ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // المخازن والبيانات الأساسية الحركية
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [users, setUsers] = useState(initialUsers);

  // --- 👤 التحكم في نظام الأمان والأدوار المباشرة ---
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // حقول إدخال شاشة إدارة المستخدمين والصلاحيات
  const [uName, setUName] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uRole, setURole] = useState('storekeeper');
  const [uDesc, setUDesc] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  // حقول الإدخال للشاشات اللوجستية
  const [prodName, setProdName] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodMinQty, setProdMinQty] = useState('');
  const [prodCategory, setProdCategory] = useState('قطع غيار ميكانيكية');
  const [prodUnit, setProdUnit] = useState('قطعة');
  const [prodLocation, setProdLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [maintProdId, setMaintProdId] = useState('');
  const [maintQty, setMaintQty] = useState('');
  const [maintReportId, setMaintReportId] = useState('');

  const [auditProdId, setAuditProdId] = useState('');
  const [auditActualQty, setAuditActualQty] = useState('');
  const [auditNotes, setAuditNotes] = useState('');

  const [inProdId, setInProdId] = useState('');
  const [inQty, setInQty] = useState('');
  const [inSupplier, setInSupplier] = useState('');
  const [inDocRef, setInDocRef] = useState('');

  const [outProdId, setOutProdId] = useState('');
  const [outQty, setOutQty] = useState('');
  const [outDept, setOutDept] = useState('');
  const [outDocRef, setOutDocRef] = useState('');

  const [supName, setSupName] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supMaterial, setSupMaterial] = useState('');

  // --- دالة تسجيل الدخول الكاملة والمتكاملة ---
  const handleLogin = () => {
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('❌ الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    const foundUser = users.find(
      (user) => user.name === loginUsername && user.password === loginPassword
    );

    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUserRole(foundUser.role);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      setCurrentScreen('dashboard');
      
      Alert.alert('مرحباً بك', `تم تسجيل الدخول بنجاح\nالدور: ${foundUser.role === 'admin' ? 'مدير نظام' : foundUser.role === 'storekeeper' ? 'أمين مخزن' : 'مهندس صيانة'}`);
    } else {
      setLoginError('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  // --- دالة تسجيل الخروج ---
  const handleLogout = () => {
    Alert.alert(
      'تسجيل خروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج من النظام؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'نعم, تسجيل خروج', 
          onPress: () => {
            setIsLoggedIn(false);
            setCurrentUserRole('admin');
          }
        }
      ]
    );
  };

  // --- دالات العمليات الحسابية والرقابية ---
  const todayDate = '2026-06-03';
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= p.minQty).length;
  const outOfStockItems = products.filter(p => p.quantity === 0).length;
  
  const todayIn = transactions.filter(tx => tx.date === todayDate && tx.type === 'وارد').reduce((sum, tx) => sum + tx.qty, 0);
  const todayOut = transactions.filter(tx => tx.date === todayDate && tx.type === 'منصرف').reduce((sum, tx) => sum + tx.qty, 0);
  const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

  // --- 🛡️ دالة التحقق الأمني من صلاحيات الدور الفعلي ---
  const verifyPermission = (allowedRoles) => {
    if (allowedRoles.includes(currentUserRole)) {
      return true;
    }
    Alert.alert('❌ رفض الوصول الأمني', 'عذراً، دورك الحالي في النظام لا يمتلك الصلاحية الكافية لإتمام هذا الإجراء.');
    return false;
  };

  // ========================================================
  // 👥 دالات إدارة المستخدمين (إضافة، تعديل، حذف)
  // ========================================================
  
  const handleSaveUser = () => {
    if (!verifyPermission(['admin'])) return;
    if (!uName || !uPassword || !uDesc) {
      return Alert.alert('تنبيه', 'يرجى ملء جميع الحقول المطلوبة للمستخدم الجديد.');
    }

    if (editingUserId) {
      setUsers(users.map(u => u.id === editingUserId ? { ...u, name: uName, password: uPassword, role: uRole, desc: uDesc } : u));
      Alert.alert('تم التعديل بنجاح', `تم تحديث بيانات المستخدم الآمن بنجاح.`);
      setEditingUserId(null);
    } else {
      const newUser = {
        id: `U-${Math.floor(10 + Math.random() * 89)}`,
        name: uName,
        password: uPassword,
        role: uRole,
        desc: uDesc
      };
      setUsers([...users, newUser]);
      Alert.alert('تم الحفظ الأمني', `تم إدراج المستخدم الجديد بنجاح.\nيمكنه الآن تسجيل الدخول باستخدام:\nالاسم: ${uName}\nكلمة المرور: ${uPassword}`);
    }

    setUName(''); setUPassword(''); setUDesc(''); setURole('storekeeper');
  };

  const handleEditUserClick = (user) => {
    if (!verifyPermission(['admin'])) return;
    setEditingUserId(user.id);
    setUName(user.name);
    setUPassword(user.password);
    setURole(user.role);
    setUDesc(user.desc);
  };

  const handleDeleteUser = (userId) => {
    if (!verifyPermission(['admin'])) return;
    if (userId === 'U-01') {
      return Alert.alert('خطأ حماية', 'لا يمكن حذف الحساب الجذري لمدير النظام!');
    }
    Alert.alert(
      'تأكيد الحذف الأمني',
      'هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'نعم، احذف', 
          onPress: () => {
            setUsers(users.filter(u => u.id !== userId));
            Alert.alert('تم الحذف', 'تم إزالة سجل المستخدم والصلاحيات الملحقة به.');
          }
        }
      ]
    );
  };

  // --- دالات الشاشات الأخرى ---
  const handleAddProduct = () => {
    if (!verifyPermission(['admin', 'storekeeper'])) return;
    if (!prodName || !prodQty || !prodMinQty || !prodLocation) return Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول');
    const newProduct = { id: `PROD-${Math.floor(1000 + Math.random() * 9000)}`, name: prodName, category: prodCategory, quantity: parseInt(prodQty), minQty: parseInt(prodMinQty), unit: prodUnit, location: prodLocation, price: 35 };
    setProducts([newProduct, ...products]);
    setProdName(''); setProdQty(''); setProdMinQty(''); setProdLocation('');
    Alert.alert('تم الحفظ', 'تم إدراج الصنف بنجاح.');
  };

  const handleMaintenanceIssue = () => {
    if (!verifyPermission(['admin', 'engineer'])) return;
    if (!maintProdId || !maintQty || !maintReportId) return Alert.alert('خطأ', 'يرجى تعبئة جميع الحقول');
    const targetId = maintProdId.trim().toUpperCase();
    const productIndex = products.findIndex(p => p.id === targetId);
    if (productIndex === -1) return Alert.alert('خطأ', 'كود الصنف غير مدرج');
    const product = products[productIndex];
    const qtyToDeduct = parseInt(maintQty);
    if (product.quantity < qtyToDeduct) return Alert.alert('⚠️ رفض الصرف', `المخزون الحالي غير كافٍ!`);
    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...product, quantity: product.quantity - qtyToDeduct };
    setProducts(updatedProducts);
    const newTx = { id: `TX-${Math.floor(500 + Math.random() * 550)}`, type: 'منصرف', productName: product.name, qty: qtyToDeduct, date: todayDate, user: currentUserRole === 'admin' ? 'مدير النظام' : 'مهندس صيانة', ref: `تقرير صيانة #${maintReportId}` };
    setTransactions([newTx, ...transactions]);
    setMaintProdId(''); setMaintQty(''); setMaintReportId('');
    Alert.alert('تم الاعتماد', 'تم الخصم وتحديث السجلات بنجاح.');
  };

  const handleInventoryAudit = () => {
    if (!verifyPermission(['admin'])) return;
    if (!auditProdId || !auditActualQty) return Alert.alert('تنبيه', 'يرجى إدخال البيانات المطلوبة');
    const targetId = auditProdId.trim().toUpperCase();
    const productIndex = products.findIndex(p => p.id === targetId);
    if (productIndex === -1) return Alert.alert('خطأ', 'الكود غير مسجل');
    const product = products[productIndex];
    const actualQty = parseInt(auditActualQty);
    const difference = actualQty - product.quantity;
    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...product, quantity: actualQty };
    setProducts(updatedProducts);
    const auditTx = { id: `TX-${Math.floor(700 + Math.random() * 200)}`, type: difference > 0 ? 'وارد' : 'منصرف', productName: `[تسوية جرد] ${product.name}`, qty: Math.abs(difference), date: todayDate, user: 'مدير النظام', ref: auditNotes ? `ملاحظة: ${auditNotes}` : 'تعديل الفارق العيني' };
    setTransactions([auditTx, ...transactions]);
    setAuditProdId(''); setAuditActualQty(''); setAuditNotes('');
    Alert.alert('تمت التسوية', 'تم تصحيح الأرصدة الحقيقية بنجاح.');
  };

  const handleGoodsInward = () => {
    if (!verifyPermission(['admin', 'storekeeper'])) return;
    if (!inProdId || !inQty || !inSupplier || !inDocRef) return Alert.alert('تنبيه', 'أكمل جميع الحقول');
    const targetId = inProdId.trim().toUpperCase();
    const productIndex = products.findIndex(p => p.id === targetId);
    if (productIndex === -1) return Alert.alert('خطأ', 'الصنف غير معرف');
    const product = products[productIndex];
    const addedQty = parseInt(inQty);
    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...product, quantity: product.quantity + addedQty };
    setProducts(updatedProducts);
    const inTx = { id: `TX-${Math.floor(800 + Math.random() * 100)}`, type: 'وارد', productName: product.name, qty: addedQty, date: todayDate, user: currentUserRole === 'admin' ? 'مدير النظام' : 'أمين المخزن', ref: `فاتورة #${inDocRef} | المورد: ${inSupplier}` };
    setTransactions([inTx, ...transactions]);
    setInProdId(''); setInQty(''); setInSupplier(''); setInDocRef('');
    Alert.alert('تم التوريد', 'تم إضافة الشحنة للرصيد الفعلي.');
  };

  const handleGoodsOutward = () => {
    if (!verifyPermission(['admin', 'storekeeper'])) return;
    if (!outProdId || !outQty || !outDept || !outDocRef) return Alert.alert('تنبيه', 'أكمل جميع الحقول');
    const targetId = outProdId.trim().toUpperCase();
    const productIndex = products.findIndex(p => p.id === targetId);
    if (productIndex === -1) return Alert.alert('خطأ', 'الصنف غير مدرج');
    const product = products[productIndex];
    const qtyToIssue = parseInt(outQty);
    if (product.quantity < qtyToIssue) return Alert.alert('فشل الصرف', 'الرصيد المتاح غير كافٍ');
    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...product, quantity: product.quantity - qtyToIssue };
    setProducts(updatedProducts);
    const outTx = { id: `TX-${Math.floor(900 + Math.random() * 100)}`, type: 'منصرف', productName: product.name, qty: qtyToIssue, date: todayDate, user: `قسم: ${outDept}`, ref: `إذن صرف #${outDocRef}` };
    setTransactions([outTx, ...transactions]);
    setOutProdId(''); setOutQty(''); setOutDept(''); setOutDocRef('');
    Alert.alert('تم الصرف', 'تم تسليم المواد وحسم الأرصدة.');
  };

  const handleAddSupplier = () => {
    if (!verifyPermission(['admin', 'storekeeper'])) return;
    if (!supName || !supPhone || !supMaterial) return Alert.alert('تنبيه', 'أدخل جميع البيانات');
    const newSupplier = { id: `SUP-${Math.floor(10 + Math.random() * 89)}`, name: supName, phone: supPhone, material: supMaterial, rating: 'نشط' };
    setSuppliers([...suppliers, newSupplier]);
    setSupName(''); setSupPhone(''); setSupMaterial('');
    Alert.alert('نجاح', 'تم إدراج المورد الجديد.');
  };

  const filteredProducts = products.filter(p => p.name.includes(searchQuery) || p.id.toLowerCase().includes(searchQuery.toLowerCase()));
  const switchScreen = (screen) => { setCurrentScreen(screen); setIsMenuOpen(false); };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>📦 نظام إدارة المخازن والصيانة</Text>
          <Text style={styles.loginSubtitle}>تسجيل الدخول إلى النظام</Text>
          
          <TextInput
            style={styles.loginInput}
            placeholder="اسم المستخدم"
            placeholderTextColor="#94a3b8"
            value={loginUsername}
            onChangeText={setLoginUsername}
            autoCapitalize="none"
            textAlign="right"
          />
          
          <TextInput
            style={styles.loginInput}
            placeholder="كلمة المرور"
            placeholderTextColor="#94a3b8"
            value={loginPassword}
            onChangeText={setLoginPassword}
            secureTextEntry
            textAlign="right"
          />
          
          {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>دخول إلى النظام</Text>
          </TouchableOpacity>
          
          <Text style={styles.loginHint}>المستخدمون المسجلون: admin, أحمد (أمين المستودع), خالد (رئيس الصيانة)</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.roleIndicator, { backgroundColor: currentUserRole === 'admin' ? '#ef4444' : currentUserRole === 'storekeeper' ? '#10b981' : '#f59e0b' }]}>
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
              {currentUserRole === 'admin' ? 'مدير نظام' : currentUserRole === 'storekeeper' ? 'أمين مخزن' : 'مهندس صيانة'}
            </Text>
          </View>
          <Text style={styles.headerTitle}>📦 إدارة المخازن والصيانة</Text>
        </View>
        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuBtn}>
          <Text style={{ fontSize: 24, color: '#fff' }}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {currentScreen === 'dashboard' && (
          <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>مرحباً بك في النظام 👋</Text>
            <View style={styles.grid}>
              <View style={[styles.card, { borderColor: '#3b82f6', borderTopWidth: 4 }]}>
                <Text style={styles.cardValue}>{totalItems}</Text>
                <Text style={styles.cardLabel}>إجمالي الأصناف</Text>
              </View>
              <View style={[styles.card, { borderColor: '#f59e0b', borderTopWidth: 4 }]}>
                <Text style={styles.cardValue}>{lowStockItems}</Text>
                <Text style={styles.cardLabel}>منخفض المخزون</Text>
              </View>
              <View style={[styles.card, { borderColor: '#ef4444', borderTopWidth: 4 }]}>
                <Text style={styles.cardValue}>{outOfStockItems}</Text>
                <Text style={styles.cardLabel}>الأصناف المنتهية</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>📈 حركة التداول اليوم</Text>
            <View style={styles.grid}>
              <View style={[styles.card, { borderColor: '#10b981', borderTopWidth: 4 }]}>
                <Text style={[styles.cardValue, { color: '#10b981' }]}>+{todayIn}</Text>
                <Text style={styles.cardLabel}>الوارد اليوم</Text>
              </View>
              <View style={[styles.card, { borderColor: '#ec4899', borderTopWidth: 4 }]}>
                <Text style={[styles.cardValue, { color: '#ec4899' }]}>-{todayOut}</Text>
                <Text style={styles.cardLabel}>المنصرف اليوم</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>⏳ آخر الحركات</Text>
            {transactions.slice(0, 5).map(tx => (
              <View key={tx.id} style={styles.listItem}>
                <View style={[styles.badge, { backgroundColor: tx.type === 'وارد' ? '#d1fae5' : '#fee2e2' }]}>
                  <Text style={{ color: tx.type === 'وارد' ? '#065f46' : '#991b1b', fontWeight: 'bold', fontSize: 13 }}>{tx.type} ({tx.qty})</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#1e293b' }}>{tx.productName}</Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>{tx.user} | {tx.date}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {currentScreen === 'products' && (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id}
            style={styles.container}
            ListHeaderComponent={
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>➕ إضافة صنف جديد</Text>
                <TextInput placeholder="اسم الصنف" placeholderTextColor="#94a3b8" value={prodName} onChangeText={setProdName} style={styles.input} />
                <View style={{ flexDirection: 'row' }}>
                  <TextInput placeholder="الحد الأدنى" placeholderTextColor="#94a3b8" value={prodMinQty} keyboardType="numeric" onChangeText={setProdMinQty} style={[styles.input, { flex: 1, marginRight: 5 }]} />
                  <TextInput placeholder="الكمية الحالية" placeholderTextColor="#94a3b8" value={prodQty} keyboardType="numeric" onChangeText={setProdQty} style={[styles.input, { flex: 1, marginLeft: 5 }]} />
                </View>
                <TextInput placeholder="موقع التخزين" placeholderTextColor="#94a3b8" value={prodLocation} onChangeText={setProdLocation} style={styles.input} />
                <TextInput placeholder="بحث..." placeholderTextColor="#94a3b8" value={searchQuery} onChangeText={setSearchQuery} style={styles.input} />
                <TouchableOpacity onPress={handleAddProduct} style={styles.btn}><Text style={styles.btnText}>حفظ الصنف</Text></TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>{item.quantity} {item.unit}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>{item.id} | {item.location}</Text>
                </View>
              </View>
            )}
          />
        )}

        {currentScreen === 'maintenance' && (
          <ScrollView style={styles.container}>
            <View style={[styles.formCard, { borderColor: '#ef4444', borderTopWidth: 5 }]}>
              <Text style={[styles.formTitle, { color: '#ef4444' }]}>⚙️ سحب مواد للصيانة</Text>
              <TextInput placeholder="كود الصنف" placeholderTextColor="#94a3b8" value={maintProdId} onChangeText={setMaintProdId} style={styles.input} autoCapitalize="characters" />
              <TextInput placeholder="الكمية" placeholderTextColor="#94a3b8" value={maintQty} keyboardType="numeric" onChangeText={setMaintQty} style={styles.input} />
              <TextInput placeholder="رقم تقرير الصيانة" placeholderTextColor="#94a3b8" value={maintReportId} onChangeText={setMaintReportId} style={styles.input} />
              <TouchableOpacity onPress={handleMaintenanceIssue} style={[styles.btn, { backgroundColor: '#ef4444' }]}><Text style={styles.btnText}>اعتماد الصرف</Text></TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'audit' && (
          <ScrollView style={styles.container}>
            <View style={[styles.formCard, { borderColor: '#f59e0b', borderTopWidth: 5 }]}>
              <Text style={[styles.formTitle, { color: '#f59e0b' }]}>🔍 تسوية الجرد العيني</Text>
              <TextInput placeholder="كود الصنف" placeholderTextColor="#94a3b8" value={auditProdId} onChangeText={setAuditProdId} style={styles.input} autoCapitalize="characters" />
              <TextInput placeholder="الكمية الفعلية" placeholderTextColor="#94a3b8" value={auditActualQty} keyboardType="numeric" onChangeText={setAuditActualQty} style={styles.input} />
              <TextInput placeholder="ملاحظات" placeholderTextColor="#94a3b8" value={auditNotes} onChangeText={setAuditNotes} style={styles.input} />
              <TouchableOpacity onPress={handleInventoryAudit} style={[styles.btn, { backgroundColor: '#f59e0b' }]}><Text style={styles.btnText}>اعتماد التسوية</Text></TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'in' && (
          <ScrollView style={styles.container}>
            <View style={[styles.formCard, { borderColor: '#10b981', borderTopWidth: 5 }]}>
              <Text style={[styles.formTitle, { color: '#10b981' }]}>📥 استلام شحنة</Text>
              <TextInput placeholder="كود الصنف" placeholderTextColor="#94a3b8" value={inProdId} onChangeText={setInProdId} style={styles.input} autoCapitalize="characters" />
              <TextInput placeholder="الكمية" placeholderTextColor="#94a3b8" value={inQty} keyboardType="numeric" onChangeText={setInQty} style={styles.input} />
              <TextInput placeholder="اسم المورد" placeholderTextColor="#94a3b8" value={inSupplier} onChangeText={setInSupplier} style={styles.input} />
              <TextInput placeholder="رقم الفاتورة" placeholderTextColor="#94a3b8" value={inDocRef} onChangeText={setInDocRef} style={styles.input} />
              <TouchableOpacity onPress={handleGoodsInward} style={[styles.btn, { backgroundColor: '#10b981' }]}><Text style={styles.btnText}>إتمام التوريد</Text></TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'out' && (
          <ScrollView style={styles.container}>
            <View style={[styles.formCard, { borderColor: '#ec4899', borderTopWidth: 5 }]}>
              <Text style={[styles.formTitle, { color: '#ec4899' }]}>📤 صرف مواد</Text>
              <TextInput placeholder="كود الصنف" placeholderTextColor="#94a3b8" value={outProdId} onChangeText={setOutProdId} style={styles.input} autoCapitalize="characters" />
              <TextInput placeholder="الكمية" placeholderTextColor="#94a3b8" value={outQty} keyboardType="numeric" onChangeText={setOutQty} style={styles.input} />
              <TextInput placeholder="القسم المستلم" placeholderTextColor="#94a3b8" value={outDept} onChangeText={setOutDept} style={styles.input} />
              <TextInput placeholder="رقم إذن الصرف" placeholderTextColor="#94a3b8" value={outDocRef} onChangeText={setOutDocRef} style={styles.input} />
              <TouchableOpacity onPress={handleGoodsOutward} style={[styles.btn, { backgroundColor: '#ec4899' }]}><Text style={styles.btnText}>اعتماد الصرف</Text></TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'suppliers' && (
          <FlatList
            data={suppliers}
            keyExtractor={item => item.id}
            style={styles.container}
            ListHeaderComponent={
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>🏭 إضافة مورد جديد</Text>
                <TextInput placeholder="اسم المورد" placeholderTextColor="#94a3b8" value={supName} onChangeText={setSupName} style={styles.input} />
                <TextInput placeholder="رقم الهاتف" placeholderTextColor="#94a3b8" value={supPhone} keyboardType="phone-pad" onChangeText={setSupPhone} style={styles.input} />
                <TextInput placeholder="التخصص" placeholderTextColor="#94a3b8" value={supMaterial} onChangeText={setSupMaterial} style={styles.input} />
                <TouchableOpacity onPress={handleAddSupplier} style={styles.btn}><Text style={styles.btnText}>💾 حفظ المورد</Text></TouchableOpacity>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={{ color: '#0369a1', fontWeight: 'bold' }}>📞 {item.phone}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text style={{ color: '#64748b', fontSize: 11 }}>{item.material}</Text>
                </View>
              </View>
            )}
          />
        )}

        {currentScreen === 'reports' && (
          <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>📈 التقارير المالية</Text>
            <View style={[styles.formCard, { borderColor: '#10b981', borderTopWidth: 4, backgroundColor: '#f0fdf4' }]}>
              <Text style={{ textAlign: 'right', color: '#166534', fontSize: 13 }}>💰 القيمة الإجمالية للمخزون:</Text>
              <Text style={{ textAlign: 'right', fontSize: 24, fontWeight: 'bold', color: '#14532d' }}>{totalStockValue} ريال</Text>
            </View>
            <View style={[styles.formCard, { borderColor: '#3b82f6', borderTopWidth: 4 }]}>
              <Text style={{ textAlign: 'right', color: '#1e40af', fontSize: 13 }}>📊 إحصائيات سريعة:</Text>
              <Text style={{ textAlign: 'right', marginTop: 5 }}>• إجمالي الأصناف: {totalItems}</Text>
              <Text style={{ textAlign: 'right' }}>• أصناف منخفضة المخزون: {lowStockItems}</Text>
              <Text style={{ textAlign: 'right' }}>• أصناف منتهية: {outOfStockItems}</Text>
              <Text style={{ textAlign: 'right' }}>• إجمالي الوارد اليوم: {todayIn}</Text>
              <Text style={{ textAlign: 'right' }}>• إجمالي المنصرف اليوم: {todayOut}</Text>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'roles' && (
          <ScrollView style={styles.container}>
            <Text style={styles.welcomeText}>👥 إدارة المستخدمين والصلاحيات</Text>
            
            <View style={[styles.formCard, { borderColor: '#3b82f6', borderTopWidth: 4 }]}>
              <Text style={styles.formTitle}>
                {editingUserId ? '📝 تعديل مستخدم' : '👤 إضافة مستخدم جديد'}
              </Text>
              
              <TextInput placeholder="اسم المستخدم" placeholderTextColor="#94a3b8" value={uName} onChangeText={setUName} style={styles.input} />
              <TextInput placeholder="كلمة المرور" placeholderTextColor="#94a3b8" value={uPassword} secureTextEntry={true} onChangeText={setUPassword} style={styles.input} />
              <TextInput placeholder="الوصف" placeholderTextColor="#94a3b8" value={uDesc} onChangeText={setUDesc} style={styles.input} />
              
              <Text style={{ textAlign: 'right', color: '#475569', fontSize: 12, marginBottom: 5 }}>الدور:</Text>
              <View style={styles.rolePickerRow}>
                <TouchableOpacity onPress={() => setURole('admin')} style={[styles.pickerBtn, uRole === 'admin' && styles.activePickerAdmin]}><Text style={styles.pickerBtnText}>مدير</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setURole('storekeeper')} style={[styles.pickerBtn, uRole === 'storekeeper' && styles.activePickerStore]}><Text style={styles.pickerBtnText}>أمين مخزن</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setURole('engineer')} style={[styles.pickerBtn, uRole === 'engineer' && styles.activePickerEng]}><Text style={styles.pickerBtnText}>مهندس</Text></TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {editingUserId && (
                  <TouchableOpacity onPress={() => { setEditingUserId(null); setUName(''); setUPassword(''); setUDesc(''); setURole('storekeeper'); }} style={[styles.btn, { flex: 1, backgroundColor: '#64748b', marginRight: 5 }]}><Text style={styles.btnText}>إلغاء</Text></TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSaveUser} style={[styles.btn, { flex: 2 }]}><Text style={styles.btnText}>{editingUserId ? 'تحديث' : 'حفظ المستخدم'}</Text></TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>👥 المستخدمون المسجلون</Text>
            {users.map(user => (
              <View key={user.id} style={[styles.roleCard, currentUserRole === user.role && styles.activeRoleCard]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => handleEditUserClick(user)} style={styles.actionMinBtn}><Text style={{ color: '#2563eb', fontSize: 12 }}>تعديل</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteUser(user.id)} style={[styles.actionMinBtn, { borderColor: '#ef4444' }]}><Text style={{ color: '#ef4444', fontSize: 12 }}>حذف</Text></TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => { setCurrentUserRole(user.role); Alert.alert('تبديل الدور', `الآن تعمل كـ: ${user.name}`); }} style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {currentUserRole === user.role && <Text style={{ fontSize: 14, marginRight: 5 }}>🟢</Text>}
                      <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>
                    </View>
                    <Text style={{ color: '#64748b', fontSize: 11 }}>{user.desc}</Text>
                    <View style={styles.refTag}><Text style={{ fontSize: 11, color: '#0284c7' }}>الدور: {user.role}</Text></View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {isMenuOpen && (
          <View style={styles.customDrawer}>
            <Text style={styles.drawerHeader}>📋 قائمة النظام</Text>
            <TouchableOpacity onPress={() => switchScreen('dashboard')} style={[styles.drawerItem, currentScreen === 'dashboard' && styles.activeItem]}><Text style={styles.drawerItemText}>📊 لوحة التحكم</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('products')} style={[styles.drawerItem, currentScreen === 'products' && styles.activeItem]}><Text style={styles.drawerItemText}>📦 إدارة الأصناف</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('maintenance')} style={[styles.drawerItem, currentScreen === 'maintenance' && styles.activeItem]}><Text style={styles.drawerItemText}>⚙️ الربط مع الصيانة</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('audit')} style={[styles.drawerItem, currentScreen === 'audit' && styles.activeItem]}><Text style={styles.drawerItemText}>🔍 الجرد والمطابقة</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('in')} style={[styles.drawerItem, currentScreen === 'in' && styles.activeItem]}><Text style={styles.drawerItemText}>📥 استلام مواد</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('out')} style={[styles.drawerItem, currentScreen === 'out' && styles.activeItem]}><Text style={styles.drawerItemText}>📤 صرف مواد</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('suppliers')} style={[styles.drawerItem, currentScreen === 'suppliers' && styles.activeItem]}><Text style={styles.drawerItemText}>🏭 الموردون</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('reports')} style={[styles.drawerItem, currentScreen === 'reports' && styles.activeItem]}><Text style={styles.drawerItemText}>📈 التقارير</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchScreen('roles')} style={[styles.drawerItem, currentScreen === 'roles' && styles.activeItem]}><Text style={styles.drawerItemText}>👥 المستخدمون</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={[styles.drawerItem, { marginTop: 10, borderTopWidth: 1, borderTopColor: '#ef4444' }]}>
              <Text style={[styles.drawerItemText, { color: '#ef4444' }]}>🚪 تسجيل الخروج</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 25,
  },
  loginInput: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 15,
    color: '#1e293b',
    fontSize: 16,
  },
  loginError: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginHint: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 20,
  },
  mainContainer: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 30 },
  topBar: { height: 60, backgroundColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, elevation: 4 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
  roleIndicator: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  menuBtn: { padding: 5 },
  container: { flex: 1, padding: 15 },
  welcomeText: { fontSize: 17, fontWeight: 'bold', marginBottom: 15, textAlign: 'right', color: '#0f172a' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: { flex: 1, backgroundColor: '#fff', margin: 4, padding: 14, borderRadius: 12, alignItems: 'center', elevation: 2 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  cardLabel: { fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginVertical: 10, textAlign: 'right', color: '#1e293b' },
  listItem: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  refTag: { backgroundColor: '#f1f5f9', alignSelf: 'flex-end', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  formCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  formTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#0f172a', textAlign: 'right' },
  input: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 10, textAlign: 'right', color: '#1e293b' },
  btn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  rolePickerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  pickerBtn: { flex: 1, paddingVertical: 8, backgroundColor: '#f1f5f9', borderRadius: 6, alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#cbd5e1' },
  pickerBtnText: { fontSize: 11, color: '#475569', fontWeight: 'bold' },
  activePickerAdmin: { backgroundColor: '#fee2e2', borderColor: '#ef4444' },
  activePickerStore: { backgroundColor: '#d1fae5', borderColor: '#10b981' },
  activePickerEng: { backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
  roleCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: '#e2e8f0' },
  activeRoleCard: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  actionMinBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#2563eb', marginHorizontal: 3, backgroundColor: '#fff' },
  customDrawer: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 240, backgroundColor: '#1e293b', padding: 15, zIndex: 999 },
  drawerHeader: { color: '#94a3b8', fontSize: 14, fontWeight: 'bold', marginBottom: 15, textAlign: 'right', borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10 },
  drawerItem: { paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#334155', alignItems: 'flex-end', paddingHorizontal: 8, borderRadius: 6 },
  activeItem: { backgroundColor: '#334155' },
  drawerItemText: { color: '#f8fafc', fontSize: 13, fontWeight: '500' }
});
