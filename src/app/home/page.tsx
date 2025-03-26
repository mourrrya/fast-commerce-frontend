"use client"
import { Drawer, Menu, MenuProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Category } from "../../interface/categoryInterface";
import { ProductWithVarinats } from "../../interface/productVariantsInterface";
import { CONSTANTS } from "@/constants/contants";

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
                        <div className="space-y-2">
                            {item.Variants.sort((a, b) => a.discounted_price - b.discounted_price).map((variant) =>
                                <div className="flex gap-2 items-center text-sm" key={variant.id} >
                                    <span>
                                        {variant.discounted_price}
                                    </span>
                                    <span>
                                        {variant.quantity}
                                    </span>
                                    <div>
                                        <img className="w-6 h-6" src={variant.website_id === CONSTANTS.WEBSITE_NAME.BLINKIT ? "https://blinkit.com/3ad33337325abf91bd78.png" : "https://cdn.zeptonow.com/web-static-assets-prod/artifacts/12.62.1/favicon.png"} alt="" />
                                    </div>
                                </div>
                            )}
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
                                    <div className="flex gap-2 items-center text-sm" >
                                        <span>
                                            {variant.discounted_price}
                                        </span>
                                        <span>
                                            {variant.quantity}
                                        </span>
                                        <div>
                                            <img className="w-6 h-6" src={variant.website_id === CONSTANTS.WEBSITE_NAME.BLINKIT ? "https://blinkit.com/3ad33337325abf91bd78.png" : "https://cdn.zeptonow.com/web-static-assets-prod/artifacts/12.62.1/favicon.png"} alt="" />
                                        </div>
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
