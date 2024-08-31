import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
    const params = useParams();

    const { data: productData, refetch } = useGetProductByIdQuery(params._id);

    const [image, setImage] = useState(productData?.image || "");
    const [name, setName] = useState(productData?.name || "");
    const [description, setDescription] = useState(
        productData?.description || ""
    );
    const [price, setPrice] = useState(productData?.price || "");
    const [category, setCategory] = useState(productData?.category || "");
    const [quantity, setQuantity] = useState(productData?.quantity || "");
    const [brand, setBrand] = useState(productData?.brand || "");
    const [stock, setStock] = useState(productData?.countInStock || "");

    // hook
    const navigate = useNavigate();

    // Fetch categories using RTK Query
    const { data: categories = [] } = useFetchCategoriesQuery();

    const [uploadProductImage] = useUploadProductImageMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
        if (productData && productData._id) {
            // console.log(productData);
            // console.log(categories);
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setCategory(productData.category || "");
            setQuantity(productData.quantity);
            setBrand(productData.brand);
            setImage(productData.image);
            setStock(productData.countInStock);
        }
    }, [productData]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success("Item added successfully", {
                position: "top-right",
                autoClose: 2000,
            });
            setImage(res.image);
        } catch (err) {
            toast.success("Item added successfully", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            if (category) formData.append("category", category);
            formData.append("quantity", quantity);
            formData.append("brand", brand);
            formData.append("countInStock", Number(stock));

            console.log("Form Data:", {
                image,
                name,
                description,
                price,
                category,
                quantity,
                brand,
                stock,
            });

            // Update product using the RTK Query mutation
            const data = await updateProduct({
                productId: params._id,
                formData,
            });

            console.log("Update response:", data);

            if (data?.error) {
                toast.error(data.error, {
                    position: "top-right",
                    autoClose: 2000,
                });
            } else {
                toast.success(`Product successfully updated`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                await refetch();
                navigate("/admin/allproductslist");
            }
        } catch (err) {
            console.log(err);
            toast.error("Product update failed. Try again.", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        try {
            let answer = window.confirm(
                "Are you sure you want to delete this product?"
            );
            if (!answer) return;

            const { data } = await deleteProduct(params._id);
            toast.success(`"${data.name}" is deleted`, {
                position: "top-right",
                autoClose: 2000,
            });
            navigate("/admin/allproductslist");
        } catch (error) {
            console.log(error);
            toast.error("Delete failed. Try again.", {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            <div className="container  xl:mx-[9rem] sm:mx-[0]">
                <div className="flex flex-col md:flex-row">
                    <AdminMenu />
                    <div className="md:w-3/4 p-3">
                        <div className="h-12">Update / Delete Product</div>

                        <div className="border mb-3 flex gap-5 rounded-lg items-center justify-center">
                            <div>
                                <label className="text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                                    {image ? image.name : "Upload image"}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={uploadFileHandler}
                                        className="text-white"
                                    />
                                </label>
                            </div>

                            {image && (
                                <div className="text-center flex mb-3 gap-10">
                                    <div className="flex flex-1 pt-2">
                                        <div className="h-[130px] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-200 to-transparent opacity-30 dark:via-neutral-400"></div>
                                    </div>
                                    <img
                                        src={image}
                                        alt="product"
                                        className="block mx-auto pt-2 pb-2 max-h-[150px]"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="p-3">
                            <div className="flex flex-wrap">
                                <div className="one">
                                    <label htmlFor="name">Name</label> <br />
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="two ml-10">
                                    <label htmlFor="name block">Price</label>{" "}
                                    <br />
                                    <input
                                        type="number"
                                        min="0"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white "
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap">
                                <div className="one">
                                    <label htmlFor="name block">Quantity</label>{" "}
                                    <br />
                                    <input
                                        type="number"
                                        min="1"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="two ml-10">
                                    <label htmlFor="name block">Brand</label>{" "}
                                    <br />
                                    <input
                                        type="text"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white "
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <label htmlFor="" className="my-5">
                                Description
                            </label>
                            <textarea
                                type="text"
                                className="p-4 mb-3 bg-[#101011]  border rounded-lg w-[95%] text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <div className="flex flex-wrap">
                                <div className="one">
                                    <label htmlFor="name block">
                                        Count In Stock
                                    </label>{" "}
                                    <br />
                                    <input
                                        type="number"
                                        min="0"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white "
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="two ml-10">
                                    <label htmlFor="">Category</label>
                                    <br />
                                    <select
                                        placeholder="Choose Category"
                                        className="p-4 mb-3 w-[24rem] border rounded-lg bg-[#101011] text-white"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                    >
                                        <option
                                            value={productData?.category?._id}
                                        >
                                            {productData?.category?.name || ""}
                                        </option>
                                        {categories?.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handleSubmit}
                                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-green-600 mr-6"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="py-4 px-10 mt-5 rounded-lg text-lg font-bold  bg-pink-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProductUpdate;
