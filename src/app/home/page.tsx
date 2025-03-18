"use client"
import { Drawer, Menu, MenuProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Category } from "../../interface/categoryInterface";
import { ProductWithVarinats } from "../../interface/productVariantsInterface";

export default function Home() {
    const [totalVariants, setTotalVariants] = useState<ProductWithVarinats[]>()
    const [selectedCategoryProductVariants, setSelectedCategoryProductVariants] = useState<ProductWithVarinats[]>()
    const [selectedProductVariants, setSelectedProductVariants] = useState<ProductWithVarinats>()
    const [categories, setCategories] = useState<Category[]>()
    const [selectedKey, setSelectedKey] = useState('1')

    useEffect(() => {
        axios.get('http://localhost:5000/api/categories').
            then((res) => setCategories(res.data.categories)).
            catch((err) => console.log(err))

        axios.get('http://localhost:5000/api/product-variants').
            then((res) => {
                const variants: ProductWithVarinats[] = res.data
                const variantVegetables = variants.filter((variant) => variant.category_id === 1)
                setTotalVariants(variants)
                setSelectedCategoryProductVariants(variantVegetables)
            }).
            catch((err) => console.log(err))

    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
        const variantCategory = totalVariants?.filter((variant) => variant.category_id === Number(e.key))
        setSelectedCategoryProductVariants(variantCategory)
        setSelectedKey(e.key)
    };

    const items: MenuProps['items'] = categories?.map((item) => (
        {
            key: item.id.toString(),
            label: item.name,
        }
    ))

    return (
        <div className="p-4 space-y-8">
            <div className="">
                <Menu
                    onClick={onClick}
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedKey]}
                    mode="horizontal"
                    items={items}
                />
            </div>

            <div className="flex gap-4 flex-wrap px-4">
                {selectedCategoryProductVariants && selectedCategoryProductVariants.map((item) => (
                    <div key={item.id} className="shadow-md p-4 flex-1 min-w-52 max-w-80 rounded cursor-pointer" onClick={() => setSelectedProductVariants(item)}>
                        <div>
                            <img className="w-full rounded" src={item.Variants[0]?.img_url ?? ""} alt={item.Variants[0]?.name ?? ""} />
                        </div>
                        <h5 className="capitalize">
                            {item.first_name}
                        </h5>
                        <div>
                            <div className="">
                                <p>Price Range</p>
                                <div className="flex gap-2 justify-between">
                                    <p className="shadow rounded-full px-2">
                                        {item.Variants.sort((a, b) => a.discounted_price - b.discounted_price)[0]?.discounted_price}
                                    </p>
                                    <p className="shadow rounded-full px-2">
                                        {item.Variants.sort((a, b) => b.discounted_price - a.discounted_price)[0]?.discounted_price}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <Drawer
                title={<p className="capitalize">{selectedProductVariants?.first_name}</p>}
                placement="right"
                size="large"
                mask={true}
                onClose={() => { setSelectedProductVariants(undefined) }}
                open={!!selectedProductVariants}
            >
                {
                    <div className="flex gap-4 flex-wrap px-4">
                        {selectedProductVariants && selectedProductVariants.Variants.map((variant) => (
                            <div key={variant.id} className="shadow-md p-4 flex-1 min-w-52 max-w-80 rounded">
                                <div>
                                    <img className="w-full rounded" src={variant.img_url ?? ""} alt={variant.name ?? ""} />
                                </div>
                                <h5 className="capitalize">{variant.name}</h5>
                                <div>
                                    <div className="">
                                        <p className="shadow rounded-full px-2">
                                            {variant.discounted_price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </Drawer>



        </div>
    );
}
