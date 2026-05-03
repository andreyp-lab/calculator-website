export const navigation = {
  main: [
    { label: 'זכויות עובדים', href: '/employee-rights' },
    { label: 'מיסוי אישי', href: '/personal-tax' },
    { label: 'משכנתא ונדל"ן', href: '/real-estate' },
    { label: 'עצמאיים', href: '/self-employed' },
    { label: '🚀 כלים מקצועיים', href: '/tools', highlight: true },
    { label: 'בלוג', href: '/blog' },
    { label: 'אודות', href: '/about' },
  ],
  footer: [
    { label: 'מדיניות פרטיות', href: '/privacy' },
    { label: 'תנאי שימוש', href: '/terms' },
    { label: 'יצירת קשר', href: '/contact' },
  ],
  categories: [
    {
      id: 'employee-rights',
      label: 'זכויות עובדים',
      href: '/employee-rights',
      description: 'מחשבונים לזכויות עובדים בישראל',
    },
    {
      id: 'personal-tax',
      label: 'מיסוי אישי',
      href: '/personal-tax',
      description: 'מחשבונים למס הכנסה וסיוד משוער',
    },
    {
      id: 'real-estate',
      label: 'משכנתא ונדל"ן',
      href: '/real-estate',
      description: 'מחשבונים למשכנתא ומס שבח',
    },
    {
      id: 'self-employed',
      label: 'עצמאיים ועסקים',
      href: '/self-employed',
      description: 'מחשבונים לעצמאיים ובעלי עסקים',
    },
  ],
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
