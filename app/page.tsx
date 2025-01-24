'use client'
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <>

            <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Login
            </button>
            <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Signup
            </button>
            <button
                onClick={() => router.push("/order")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Order
            </button>
            <button
                onClick={() => router.push("/stock")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Stock
            </button>
            <button
                onClick={() => router.push("/edit-stock")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Edit stock
            </button>
            <button
                onClick={() => router.push("/gestion-order")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Gestion Order
            </button>
        </>
    );
}
