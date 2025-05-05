import 'server-only';
export const dynamic = 'force-dynamic';

import client from '../../../../lib/appwrite_client';
import * as sdk from 'node-appwrite';

import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

interface Speaker {
  documentId: string;
  isAdmin: boolean;
  fullName: string;
  xUrl?: string | null;
  linkedInUrl?: string;
  imageUrl?: string;
}

export async function GET() {
  // In development, we use faker to generate random data
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_APPWRITE_HASKEY === 'false'
  ) {
    return NextResponse.json(generateFakeData());
  }

  const databases = new sdk.Databases(client);
  const response = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID as string,
    'peoples',
    [sdk.Query.limit(100)]
  );

  const peopleData = response.documents.map((doc) => {
    return {
      documentId: doc.$id,
      isAdmin: doc.isAdmin,
      fullName: doc.fullName,
      xUrl: doc.xUrl,
      linkedInUrl: doc.linkedInUrl,
      imageUrl: doc.imageUrl,
    };
  }) as Speaker[];

  return NextResponse.json(peopleData);
}

function generateFakeData(): Speaker[] {
  const fakeData = [] as Speaker[];
  for (let i = 5; i < 50; i++) {
    const fakeFullName = faker.person.fullName();
    fakeData.push({
      documentId: i.toString(),
      isAdmin: false,
      fullName: fakeFullName,
      xUrl: 'https://example.com',
      linkedInUrl: 'https://linkedin.com',
      imageUrl: `/api/person-image?name=${fakeFullName}`,
    });
  }

  return [
    {
      documentId: '1',
      isAdmin: true,
      fullName: 'Danny Thompson',
      xUrl: 'https://x.com/DThompsonDev',
      linkedInUrl: 'https://www.linkedin.com/in/dthompsondev/',
      imageUrl: '/assets/people/Danny_Thompson.png',
    },
    {
      documentId: '2',
      isAdmin: true,
      fullName: 'Dennis Garcia',
      xUrl: 'https://x.com/dgarcia_appdev',
      linkedInUrl: 'https://www.linkedin.com/in/dgarcia-appdev/',
      imageUrl: '/assets/people/Dennis_Garcia.jpg',
    },
    {
      documentId: '3',
      isAdmin: true,
      fullName: 'Clint Myers',
      xUrl: null,
      linkedInUrl: 'https://www.linkedin.com/in/clintmyers/',
      imageUrl: '/assets/people/Clint_Myers.jpg',
    },
    {
      documentId: '4',
      isAdmin: true,
      fullName: 'Erik Andersen',
      xUrl: null,
      linkedInUrl: 'https://www.linkedin.com/in/ebandersen/',
      imageUrl: '/assets/people/Erik_Andersen.jpg',
    },
    ...fakeData,
  ];
}
