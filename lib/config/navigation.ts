export const navigation = {
  main: [
    { label: '👤 שכירים', href: '/salaried' },
    { label: '💼 עצמאיים', href: '/self-employed' },
    { label: '📂 נושאים אחרים', href: '/topics' },
    { label: '🚀 כלים לבעלי עסקים', href: '/tools', highlight: true },
  ],
  footer: [
    { label: 'מדיניות פרטיות', href: '/privacy' },
    { label: 'תנאי שימוש', href: '/terms' },
    { label: 'יצירת קשר', href: '/contact' },
  ],
  // קטגוריות לדף הבית - 4 קטגוריות עיקריות
  categories: [
    {
      id: 'salaried',
      label: 'שכירים',
      href: '/salaried',
      description: 'החזר מס, נטו/ברוטו, פיצויים, דמי הבראה, דמי לידה ועוד',
      icon: '👤',
    },
    {
      id: 'self-employed',
      label: 'עצמאיים ועסקים',
      href: '/self-employed',
      description: 'מע"מ, מקדמות מס, ביטוח לאומי, תמחור שעה',
      icon: '💼',
    },
    {
      id: 'tools',
      label: 'כלים לבעלי עסקים',
      href: '/tools',
      description: 'תקציב, תזרים, ניתוח דוחות, חיזוי, הערכת שווי',
      icon: '🚀',
    },
    {
      id: 'topics',
      label: 'נושאים אחרים',
      href: '/topics',
      description: 'משכנתא ונדל"ן, חיסכון והשקעות, ביטוחים, רכב',
      icon: '📂',
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
