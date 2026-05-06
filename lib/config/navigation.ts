export const navigation = {
  main: [
    { label: '👤 שכירים', href: '/salaried' },
    { label: '💼 עצמאיים', href: '/self-employed' },
    { label: 'משכנתא ונדל"ן', href: '/real-estate' },
    { label: 'השקעות', href: '/investments' },
    { label: 'חיסכון', href: '/savings' },
    { label: 'רכב', href: '/vehicles' },
    { label: 'ביטוחים', href: '/insurance' },
    { label: '🚀 כלים לבעלי עסקים', href: '/tools', highlight: true },
  ],
  footer: [
    { label: 'מדיניות פרטיות', href: '/privacy' },
    { label: 'תנאי שימוש', href: '/terms' },
    { label: 'יצירת קשר', href: '/contact' },
  ],
  // קטגוריות לדף הבית - פיננסים אישיים
  categories: [
    {
      id: 'salaried',
      label: 'שכירים',
      href: '/salaried',
      description: 'החזר מס, נטו/ברוטו, פיצויים, דמי הבראה, דמי לידה',
      icon: '👤',
    },
    {
      id: 'self-employed',
      label: 'עצמאיים ועסקים',
      href: '/self-employed',
      description: 'מע"מ, מקדמות מס, ביטוח לאומי',
      icon: '💼',
    },
    {
      id: 'real-estate',
      label: 'משכנתא ונדל"ן',
      href: '/real-estate',
      description: 'משכנתא, מס רכישה, מס שבח',
      icon: '🏠',
    },
    {
      id: 'investments',
      label: 'השקעות וחיסכון',
      href: '/investments',
      description: 'ריבית דריבית, ROI, תכנון פרישה',
      icon: '📈',
    },
    {
      id: 'savings',
      label: 'חיסכון וחובות',
      href: '/savings',
      description: 'תקציב משפחתי, החזרי הלוואה',
      icon: '💳',
    },
    {
      id: 'vehicles',
      label: 'רכב ותחבורה',
      href: '/vehicles',
      description: 'עלות דלק, ליסינג vs קנייה',
      icon: '🚗',
    },
    {
      id: 'insurance',
      label: 'ביטוחים',
      href: '/insurance',
      description: 'פנסיה צפויה, ביטוח חיים',
      icon: '💼',
    },
  ],
  // כלים מקצועיים B2B
  professionalTools: [
    {
      id: 'unified',
      label: 'מערכת מאוחדת',
      href: '/tools/unified',
      description: 'תקציב + תזרים + ניתוח דוחות',
      badge: 'מומלץ',
    },
    {
      id: 'budget',
      label: 'תכנון תקציב',
      href: '/tools/budget',
      description: 'P&L, הכנסות, הוצאות, עובדים',
    },
    {
      id: 'cash-flow',
      label: 'תזרים מזומנים',
      href: '/tools/cash-flow',
      description: 'יתרות בנק ותחזיות',
    },
    {
      id: 'financial-analysis',
      label: 'ניתוח דוחות',
      href: '/tools/financial-analysis',
      description: 'יחסים, Z-Score, דירוג אשראי',
    },
  ],
};
