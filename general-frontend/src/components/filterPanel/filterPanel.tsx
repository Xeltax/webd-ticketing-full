import React, { useState, useEffect } from "react";
import { Input, Checkbox, DatePicker, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "@/styles/Event.module.css";
import {Event} from "@/types/event";

const { Option } = Select;

const FilterPanel = (props : { events : Event[] | null, setFilteredEvents : (events : Event[] | null) => void }) => {
    // État des filtres
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
    const [categoryOptions, setCategoryOptions] = useState<{ label: string | undefined; value: string | undefined }[]>([]);
    const [locationOptions, setLocationOptions] = useState<{ label: string | undefined; value: string | undefined }[]>([]);

    // Fonction pour obtenir les catégories uniques
    useEffect(() => {
        const getUniqueCategories = () => {
            const uniqueCategories = Array.from(
                new Map(props.events?.map(event => [event.categorieId, event.categorie])).values()
            );
            return uniqueCategories.map(cat => ({ label: cat?.name, value: cat?.id }));
        };

        setCategoryOptions(getUniqueCategories());
    }, [props.events]);

    useEffect(() => {
        const getUniqueLocations = () => {
            const uniqueLocations = Array.from(new Set(props.events?.map(event => event.location)));
            return uniqueLocations.map(loc => ({ label: loc, value: loc }));
        };

        setLocationOptions(getUniqueLocations());
    }, [props.events]);

    // Appliquer les filtres chaque fois qu'un état change
    useEffect(() => {
        const filtered = filterEvents(props.events, {
            search,
            categories: selectedCategories,
            date: selectedDate,
            location: selectedLocation,
        });
        // @ts-ignore
        props.setFilteredEvents(filtered);
    }, [search, selectedCategories, selectedDate, selectedLocation, props.events]);

    // Fonction pour filtrer les événements
    const filterEvents = (events: Event[] | null, filters: any) => {
        return events?.filter(event => {
            const matchesSearch = filters.search
                ? event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.description.toLowerCase().includes(filters.search.toLowerCase())
                : true;

            const matchesCategory = filters.categories?.length
                ? filters.categories.includes(event.categorieId)
                : true;

            const matchesDate = filters.date
                ? dayjs(event.date).format("YYYY-MM-DD") === filters.date
                : true;

            const matchesLocation = filters.location
                ? event.location.toLowerCase() === filters.location.toLowerCase()
                : true;

            return matchesSearch && matchesCategory && matchesDate && matchesLocation;
        });
    };

    return (
        <div className={styles.filterPanelContainer}>
            <div className={styles.filterPanel}>
                <p className={styles.panelTitle}>Filtre</p>

                {/* Recherche */}
                <div className={styles.filterPanelModule}>
                    <p className={styles.filterPanelModuleText}>Recherche</p>
                    <Input
                        addonBefore={<SearchOutlined />}
                        placeholder="Chercher un événement"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Catégorie */}
                <div className={styles.filterPanelModule}>
                    <p className={styles.filterPanelModuleText}>Catégorie</p>
                    <Checkbox.Group
                        // @ts-ignore
                        options={categoryOptions}
                        onChange={setSelectedCategories}
                        style={{ display: "flex", flexDirection: "column" }}
                    />
                </div>

                {/* Date */}
                <div className={styles.filterPanelModule}>
                    <p className={styles.filterPanelModuleText}>Date</p>
                    <DatePicker
                        placeholder="Choisissez une date"
                        style={{ width: "100%" }}
                        onChange={(date) => setSelectedDate(date ? date.format("YYYY-MM-DD") : undefined)}
                    />
                </div>

                {/* Lieu */}
                <div className={styles.filterPanelModule}>
                    <p className={styles.filterPanelModuleText}>Lieu</p>
                    <Select
                        showSearch
                        placeholder="Choisir une ville"
                        style={{ width: "100%" }}
                        onChange={setSelectedLocation}
                        allowClear
                        options={locationOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
