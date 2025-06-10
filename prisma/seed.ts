import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  { name: 'Anaïs François', email: 'anais.francois@ianord.com', password: 'bK4vdG6jCNJfQr58htYw42UAzaDRKCv7', role: Role.USER },
  { name: 'Angélique Mahieu', email: 'angelique.mahieu@ianord.com', password: 'uQxE6OMon2Zf5RAtRsp8K2JjfVjXrvVK', role: Role.USER },
  { name: 'Aurélie Joly', email: 'aurelie.joly@ianord.com', password: 'sHST81Nlkbl7WplzLtMtl2edIiXRr3pm', role: Role.USER },
  { name: 'Badr-Eddine Salmi', email: 'badr-eddine.salmi@ianord.com', password: 'uAyWG2m8KImk72fAJuok2ixamZHMPx0u', role: Role.USER },
  { name: 'Benoit Brasselet', email: 'benoit.brasselet@ianord.com', password: 'fCVbnsIhJ5MeWAtGfyoZt0TDhJr11eq9', role: Role.USER },
  { name: 'Caroline Brygo', email: 'caroline.brygo@ianord.com', password: 'PDvLswvi01U28i7X9JKiV0o1BGt3R0sb', role: Role.USER },
  { name: 'Caroline Vanderstichel', email: 'caroline.vanderstichel@ianord.com', password: 'hTRnLjRHFrwEpiABKGRHdCwltWm488v3', role: Role.USER },
  { name: 'Célia De Paolis', email: 'celia.paolis@ianord.com', password: '5zBhZwqCkV177Oy3fO3TvZzPAIm40r9D', role: Role.USER },
  { name: 'Elliot Attenborough', email: 'elliot.attenborough@ianord.com', password: 'T8ik4VmDS6gI8lBQWRMw45d5K3PR6Gmo', role: Role.USER },
  { name: 'Florent Girard', email: 'florent.girard@ianord.com', password: 'VS1VXQMAYLpt5PAuGF6GsdXfqz5gTgKX', role: Role.USER },
  { name: 'Germain Lannoye', email: 'germain.lannoye@ianord.com', password: 'wYECseqyKyNReCk35adVPP41nxkRQgFQ', role: Role.USER },
  { name: 'Guillaume Deleuze', email: 'guillaume.deleuze@ianord.com', password: 'ndzfpGuPqFvhSq5MDjUdHA3e4gFB88xa', role: Role.USER },
  { name: 'Guillaume Gerondi', email: 'guillaume.gerondi@ianord.com', password: 'dcHn9j7LuXXqrWemJ1bQx3IFArGvwGlh', role: Role.USER },
  { name: 'Guillaume Maufroid', email: 'guillaume.maufroid@ianord.com', password: '22F70bjbNNDeoT1VLQpSMjRPvkez6p6C', role: Role.USER },
  { name: 'Hélène Dablemont', email: 'helene.dablemont@ianord.com', password: 'aIpwNFgLUZNL5vCJ6Wljc6onAbQSbefL', role: Role.USER },
  { name: 'Hugo Coleau', email: 'hugo.coleau@ianord.com', password: 'hTdb9WHVJRepQQggO4SNGSJ3HN5LYwz4', role: Role.USER },
  { name: 'Johann Hallier', email: 'johann.hallier@ianord.com', password: 'hW4AWJ7KVnd5VfTPDFIz0Gm7NAdIrK6U', role: Role.USER },
  { name: 'Julie Decoster', email: 'julie.decoster@ianord.com', password: 'oxSbbyRjqHD8myNr3uvqv0IcQgEE2CaW', role: Role.USER },
  { name: 'Julien Ledoux', email: 'julien.ledoux@ianord.com', password: 'tALbtHfaQxj4arbzO3AiQ3IK2nsW56oY', role: Role.USER },
  { name: 'Julien Lefebvre', email: 'julien.lefebvre@ianord.com', password: '3OEy50Kam33aGyaGVWkhfy6lbkInp4yT', role: Role.USER },
  { name: 'Kyllian Campagne', email: 'kyllian.campagne@ianord.com', password: 'MVhdBFE7OJv5OBdWHJFP1maWJhsOvht5', role: Role.USER },
  { name: 'Lilou Deblock', email: 'lilou.deblock@ianord.com', password: 'um8V9AaOSqznb7NidEKjRvQdiWtUqvSD', role: Role.USER },
  { name: 'Loïc Tonnelier', email: 'loic.tonnelier@ianord.com', password: 'iB9xmHwD0efAL4PhooriJsrZJI0Qz7iV', role: Role.USER },
  { name: 'Lucas Defossez', email: 'lucas.defossez@ianord.com', password: 'C6qByGqvkhi5njF6PJRxES0k9NpfYWJu', role: Role.USER },
  { name: 'Lucas Vanhoute', email: 'lucas.vanhoute@ianord.com', password: '0AuCjpKJbnRagPMjKgh2EBv5E0Jcdbia', role: Role.USER },
  { name: 'Marine Decarpentier', email: 'marine.decarpentier@ianord.com', password: 'wJGpc8xzq7EjKdyVdpfX6Xz138AxwSK1', role: Role.USER },
  { name: 'Matthieu Violier', email: 'matthieu.violier@ianord.com', password: 'ixXSVNeBhlPDv9PAxcdwmpQzHDRHdzPt', role: Role.USER },
  { name: 'Maxime Fournier', email: 'maxime.fournier@ianord.com', password: 'aropGoaAIYigp89ImG4JewkPDpcovjUo', role: Role.USER },
  { name: 'Mehdi Seghir', email: 'mehdi.seghir@ianord.com', password: 'Zha9YvBqT7xXKKeBHymwoVm2VGA4fuy0', role: Role.USER },
  { name: 'Odysseus Ribeiro', email: 'odysseus.ribeiro@ianord.com', password: '999ktXLKtIWqZmqo3CvORmUpJ1Vl8Dcm', role: Role.USER },
  { name: 'Olivier Poirette', email: 'olivier.poirette@ianord.com', password: 'bYigv3RIDqaWAWgpi0fm3qBc2XTBGu26', role: Role.USER },
  { name: 'Pierre Hochart', email: 'pierre.hochart@ianord.com', password: 'Qc3VWEdKtL6Kfz9eQl1NfLti2bzGQA5T', role: Role.USER },
  { name: 'Pierre Leclerq', email: 'pierre.leclerq@ianord.com', password: 'cXQx5tq20S24gls4PqMBKU76MkLxj7vb', role: Role.USER },
  { name: 'Quentin Bernard', email: 'quentin.bernard@ianord.com', password: 'yKA8CyjOStvxnGMb0t4DzGlP8tlxIMHL', role: Role.USER },
  { name: 'Quentin Fitament', email: 'quentin.fitament@ianord.com', password: 'Eb5SsqqLvmbLKjoX8VGwhhHRBLXxg817', role: Role.USER },
  { name: 'Quentin Sagardoy', email: 'quentin.sagardoy@ianord.com', password: 'nRKU2vloKZ0SxiBhK1CG1rtPNXhQfWZz', role: Role.USER },
  { name: 'Romain Duchatelle', email: 'romain.duchatelle@ianord.com', password: 'lqYylwLkAkvbTpBEXfrvZLH0ET4AhxQf', role: Role.USER },
  { name: 'Simon Rousselle', email: 'simon.rousselle@ianord.com', password: 'Lv9Jss5v3ykibJ7L1EawWjHQVUF7OEHt', role: Role.USER },
  { name: 'Steeve Matou', email: 'steeve.matou@ianord.com', password: 'jTxdXzqKEyG7o5o4of0FPBaZeVxA5Sxn', role: Role.USER },
  { name: 'Virginie Lesieur', email: 'virginie.lesieur@ianord.com', password: 'dFExIRAG6FqF8PmVJmqBNDhYoyUeUzaY', role: Role.USER },
  { name: 'Baptist Hecht', email: 'baptist.hecht@ianord.com', password: '1234', role: Role.ADMIN },
  { name: 'Marc Belloli', email: 'marc.belloli@ianord.com', password: 'hDqb9arr6bMF', role: Role.ADMIN },
];

async function main() {
  const hashedPassword = await bcrypt.hash('ianord', 10);
  
  // Création de l'admin
  await prisma.user.upsert({
    where: { email: 'admin@ianord.com' },
    update: {},
    create: {
      email: 'admin@ianord.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'IANord',
      role: 'ADMIN',
    },
  });

  // Création des utilisateurs
  for (const user of users) {
    const [firstName, ...lastNameParts] = user.name.split(' ');
    const lastName = lastNameParts.join(' ');
    const hashedUserPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedUserPassword,
        firstName,
        lastName,
        role: user.role,
      },
    });
  }

  const parkingSpots = [
    ...Array.from({ length: 8 }, (_, i) => ({
      number: (21 + i).toString(),
    })),
    ...Array.from({ length: 3 }, (_, i) => ({
      number: (45 + i).toString(),
    })),
    ...Array.from({ length: 7 }, (_, i) => ({
      number: (74 + i).toString(),
    })),
  ];

  for (const spot of parkingSpots) {
    await prisma.parkingSpot.upsert({
      where: { number: spot.number },
      update: {},
      create: {
        number: spot.number,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 