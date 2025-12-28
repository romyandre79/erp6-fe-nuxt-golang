export const usePusatGadaiContent = () => {
  const branding = {
    name: 'Pusat Gadai Indonesia',
    logoText: 'PG',
    primaryColor: '#1f3c88',
    secondaryColor: '#F4C430',
  };

  const navigation = [
    { label: 'Produk & Layanan', link: '#produk' },
    { label: 'Beranda', link: '#' },
    { label: 'Tentang Kami', link: '#tentang' },
    { label: 'Berita', link: '#' },
    { label: 'Karir', link: '#' },
  ];

  const hero = {
    title: 'Solusi Keuangan Cepat & Aman',
    subtitle: 'Gadaikan barang berharga Anda dengan proses transparan, aman, dan terpercaya. Resmi diawasi OJK.',
    ctaText: 'Hitung Simulasi',
    ctaLink: '#simulasi',
    secondaryCtaText: 'Hubungi Kami',
    secondaryCtaLink: '#contact',
    stats: [
      { value: '500+', label: 'Cabang' },
      { value: '100rb+', label: 'Nasabah' },
      { value: '15m+', label: 'Pencairan Cepat' },
    ],
  };

  const services = [
    {
      id: 1,
      title: 'Gadai Elektronik',
      description: 'Terima laptop, HP, kamera, TV, dan elektronik lainnya dengan taksiran tinggi.',
      icon: 'i-heroicons-device-phone-mobile',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 2,
      title: 'Gadai Emas',
      description: 'Solusi dana cepat dengan jaminan emas perhiasan atau logam mulia. Aman dan berasuransi.',
      icon: 'i-heroicons-sparkles',
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      id: 3,
      title: 'Gadai BPKB',
      description: 'Pinjaman dana tunai dengan jaminan BPKB motor atau mobil. Bunga ringan.',
      icon: 'i-heroicons-truck',
      color: 'bg-green-50 text-green-600',
    },
  ];

  const benefits = [
    {
      title: 'Diawasi OJK',
      desc: 'Tenang, transaksi Anda aman dan legal.',
      icon: 'i-heroicons-shield-check',
    },
    {
      title: 'Pencairan Cepat',
      desc: 'Dana cair dalam hitungan menit.',
      icon: 'i-heroicons-bolt',
    },
    {
      title: 'Taksiran Tinggi',
      desc: 'Kami menghargai barang Anda dengan harga terbaik.',
      icon: 'i-heroicons-currency-dollar',
    },
    {
      title: 'Tanpa Biaya Tersembunyi',
      desc: 'Transparan sejak awal.',
      icon: 'i-heroicons-document-magnifying-glass',
    },
  ];

  const footer = {
    address:
      'Jl. Arteri Klapa Dua No. 90, RT.1/RW.4, Klp. Dua, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11550',
    phones: ['(021) 22530123', '(021) 33456789'],
    socials: [
      { icon: 'i-simple-icons-instagram', link: '#' },
      { icon: 'i-simple-icons-facebook', link: '#' },
      { icon: 'i-simple-icons-youtube', link: '#' },
      { icon: 'i-simple-icons-tiktok', link: '#' },
    ],
    links: [
      { label: 'Kebijakan Privasi', url: '#' },
      { label: 'Syarat & Ketentuan', url: '#' },
      { label: 'FAQ', url: '#' },
    ],
  };

  return {
    branding,
    navigation,
    hero,
    services,
    benefits,
    footer,
  };
};
