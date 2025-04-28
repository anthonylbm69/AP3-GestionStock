import React, { Suspense } from 'react';
import DetailsStockForm from '@/components/detailStockForm';

export default function Page() {
    return (
        <div className="flex justify-center">
            <Suspense fallback={<p className="text-center mt-20">Chargement...</p>}>
                <DetailsStockForm />
            </Suspense>
        </div>
    );
}
